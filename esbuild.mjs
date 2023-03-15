import esbuild from "esbuild";
import {sassPlugin} from 'esbuild-sass-plugin'
import {htmlPlugin} from '@craftamap/esbuild-plugin-html';
import {readFile, rm} from 'node:fs/promises';

const devMode = process.argv.includes('--dev');

const context = await esbuild.context({
    entryPoints: devMode ? [
        'src/dev.ts',
        'src/index.ts',
    ] : [
        'src/index.ts'
    ],
    outdir: 'build',
    metafile: true,
    bundle: true,
    sourcemap: true,
    minify: true,
    target: [
        'chrome58',
        'firefox57',
        'safari11'
    ],
    assetNames: 'static/[name]',
    loader: {
        '.ttf': 'copy',
        '.woff2': 'copy',
    },
    plugins: [
        sassPlugin(),
        htmlPlugin({
            files: [
                {
                    filename: 'index.html',
                    entryPoints: [
                        'src/index.ts',
                        'src/dev.ts',
                    ],
                    title: 'SQNZ.live',
                    htmlTemplate: await readFile('src/index.html')
                }
            ]
        }),
        {
            name: 'logger',
            setup(build) {
                build.onStart(() => {
                    console.log('compiling...');
                });
                build.onEnd(() => {
                    console.log('done');
                });
            }
        }
    ],
});

await rm('build', {
    recursive: true,
    force: true,
});
if (devMode) {
    console.log('serving...');
    await context.serve({
        servedir: 'build',
        port: 3000,
    });
    console.log('watching...');
    await context.watch({});
} else {
    await context.rebuild();
    await context.dispose();
}
