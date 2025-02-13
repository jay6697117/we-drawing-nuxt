const API_URL = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis";
const TASK_URL = "https://dashscope.aliyuncs.com/api/v1/tasks";

interface TaskResult {
    request_id: string;
    output: {
        task_id: string;
        task_status: string;
        submit_time: string;
        scheduled_time: string;
        end_time: string;
        results: Array<{
            url: string;
        }>;
        task_metrics: {
            TOTAL: number;
            SUCCEEDED: number;
            FAILED: number;
        };
    };
    usage: {
        image_count: number;
    };
}

interface ImageResponse {
    output: {
        task_id: string;
        task_status: string;
        results?: Array<{
            url: string;
        }>;
    };
    request_id: string;
}

async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkTaskStatus(token: string, taskId: string): Promise<TaskResult> {
    const res = await fetch(`${TASK_URL}/${taskId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await res.json();
    console.log("Task Check Response:", JSON.stringify(data, null, 2));
    return data;
}

export async function getImageBySentence(token: string, prompt: string): Promise<{ images: string[] }> {
    try {
        // 1. 提交任务
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "X-DashScope-Async": "enable",
            },
            body: JSON.stringify({
                model: "wanx-v1",
                input: {
                    prompt: `${prompt}，中国古代场景，水墨画风格，工笔重彩，意境优美，画面精致，构图完整，光影层次丰富`,
                },
                parameters: {
                    style: "<auto>",
                    size: "1280*720",
                    n: 2,
                    seed: Math.floor(Math.random() * 1000000),
                },
            }),
        });

        let data: ImageResponse = await res.json();
        console.log("Initial API Response:", data);

        if (!res.ok || data.output?.task_status === "FAILED") {
            const errorMessage = data?.output?.task_status || res.statusText;
            throw new Error(`API Error: ${errorMessage}`);
        }

        // 2. 轮询任务状态
        const taskId = data.output?.task_id;
        if (!taskId) {
            throw new Error("No task ID returned");
        }

        let retries = 0;
        const maxRetries = 30; // 最多等待 30 * 2 = 60 秒

        while (retries < maxRetries) {
            await sleep(2000);

            const taskResult = await checkTaskStatus(token, taskId);
            console.log("Task Status:", taskResult.output.task_status);

            if (taskResult.output.task_status === "SUCCEEDED") {
                if (!taskResult.output?.results) {
                    throw new Error("No results in successful response");
                }
                return {
                    images: taskResult.output.results.map((result) => result.url),
                };
            } else if (taskResult.output.task_status === "FAILED") {
                throw new Error("Task failed");
            }

            retries++;
        }

        throw new Error("Task timeout");
    } catch (error) {
        console.error("Error generating image:", error);
        throw error;
    }
}
