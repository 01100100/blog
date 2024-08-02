import { defineStackbitConfig } from '@stackbit/types';
import { GitContentSource } from "@stackbit/cms-git";

export default defineStackbitConfig({
    stackbitVersion: '0.3.89',
    ssgName: 'custom',
    devCommand: `hugo hugo server --disableFastRender --port 3000`,
    contentSources: [
        new GitContentSource({
            rootPath: __dirname,
            contentDirs: ["content"],
            models: [
                {
                    name: "posts",
                    type: "page",
                    urlPath: "/posts/{slug}/",
                    filePath: "content/posts/{slug}.md",
                    fields: [
                        { type: "string", name: "title", label: "Title", required: true },
                        { type: "string", name: "subtitle", label: "Subtitle" },
                        { type: "datetime", name: "date", label: "Date" },
                        { type: "datetime", name: "lastmod", label: "Lastmod" },
                        { type: "boolean", name: "draft", label: "Draft" },
                        { type: "list", name: "authors", label: "Authors", items: { type: "string" } },
                        { type: "string", name: "description", label: "Description" },
                        { type: "list", name: "tags", label: "Tags", items: { type: "string" } },
                        { type: "list", name: "categories", label: "Categories", items: { type: "string" } },
                        { type: "list", name: "series", label: "Series", items: { type: "string" } },
                        { type: "boolean", name: "hiddenFromHomePage", label: "Hidden From Home Page" },
                        { type: "boolean", name: "hiddenFromSearch", label: "Hidden From Search" },
                        { type: "string", name: "featuredImage", label: "Featured Image" },
                        { type: "string", name: "featuredImagePreview", label: "Featured Image Preview" },
                        {
                            type: "object",
                            name: "toc",
                            label: "Toc",
                            fields: [
                                { type: "boolean", name: "enable", label: "Enable" },
                                { type: "boolean", name: "auto", label: "Auto" }
                            ]
                        },
                        {
                            type: "object",
                            name: "math",
                            label: "Math",
                            fields: [
                                { type: "boolean", name: "enable", label: "Enable" }
                            ]
                        },
                        { type: "boolean", name: "lightgallery", label: "Lightgallery" },
                        { type: "string", name: "license", label: "License" },
                        { type: "string", name: "summary", label: "Summary" },
                        {
                            type: "object",
                            name: "code",
                            label: "Code",
                            fields: [
                                { type: "number", name: "maxShownLines", label: "Max Shown Lines", subtype: "int" }
                            ]
                        }
                    ]
                }
            ],
            assetsConfig: {
                referenceType: "static",
                staticDir: "static",
                uploadDir: "images",
                publicPath: "/"
            }
        }),
    ],
});