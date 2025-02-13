declare module 'minimist' {
    function minimist(args: string[]): { [key: string]: any }
    export = minimist
}
