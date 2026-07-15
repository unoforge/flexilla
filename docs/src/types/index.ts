export type SeoType = {
    ogImage: {
        src: string;
        alt: string;
    };
    keywords: string;
    title: string;
    description: string;
};



export type SupportedLanguage = "html" | "css" | "js" | "ts" | "vue"

export interface CodeSnippet {
    title: string;
    icon:string
    lang: SupportedLanguage;
    code: string;
}

export interface SourceData {
  [source: string]: CodeSnippet;
}
