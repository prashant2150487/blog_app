import Embed from "@editorjs/embed"
import List from "@editorjs/list"
import Image from "@editorjs/image"
import Quote from "@editorjs/quote"
import Marker from "@editorjs/marker"
import InlineCode from "@editorjs/inline-code"
import Header from '@editorjs/header';


export const tools = {
    embed: Embed,
    list: {
        class: List,
        inlineToolBar: true
    },
    image: Image,
    header: {
        class: Header,
        config: {
            placeholder: 'Type Heading...',
            levels: [2, 3],
            defaultLavel: 2

        }
    },
    quote: Quote,
    marker: Marker,
    inlineCode: InlineCode,
}