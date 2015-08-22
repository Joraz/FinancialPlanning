module.exports = function (grunt) {
    grunt.initConfig({
        ts: {
            default: {
                src: ["public/javascripts/**/*.ts", "public/javascripts/app.ts"],
                dest: 'public/dist/app.js',
                reference: "reference.ts",
                options: {
                    target: 'es5',
                    module: 'commonjs',
                    sourceMap: true,
                    declaration: true,
                    removeComments: false
                }

            }
        }
    });
    grunt.loadNpmTasks("grunt-ts");
    grunt.registerTask("default", ["ts"]);
};