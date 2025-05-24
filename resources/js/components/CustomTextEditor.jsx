import { useRef } from "react"
import { Editor } from '@tinymce/tinymce-react';

export const CustomTextEditor = ({
    onParent = '',
    defaultValue = '',
    editorRef = null // ← Optional ref passed from parent
}) => {
    const internalEditorRef = useRef(null);

    const log = () => {
        const ref = editorRef || internalEditorRef;
        if (ref.current) {
            console.log(ref.current.getContent());
        }
    };

    return (
        <>
            <Editor
                apiKey='ngeu2fujgq0yloygchhlnok0kznk80osam5rzqxf5268kxtp'
                onInit={(_evt, editor) => {
                    if (editorRef) {
                        editorRef.current = editor;
                    } else {
                        internalEditorRef.current = editor;
                    }
                }}
                initialValue={defaultValue}
                init={{
                    height: 200,
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
            />
        </>
    );
};

export const CustomControlledTextEditor = ({
    onParent = '',
    defaultValue = '',
    editorRef = null,
    value,
    onChange = (newValue) => {}
}) => {
    const internalEditorRef = useRef(null);

    return (
        <>
            <Editor
                apiKey='ngeu2fujgq0yloygchhlnok0kznk80osam5rzqxf5268kxtp'
                onInit={(_evt, editor) => {
                    if (editorRef) {
                        editorRef.current = editor;
                    } else {
                        internalEditorRef.current = editor;
                    }
                }}
                initialValue={defaultValue}
                value={value}
                onEditorChange={(newValue, editor) => onChange(newValue)}
                init={{
                    height: 200,
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
            />
        </>
    );
};
