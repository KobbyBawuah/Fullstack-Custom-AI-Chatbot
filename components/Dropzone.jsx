import React, { use, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'

const Dropzone = ({ className }) => {
    const [files, setFiles] = useState([])

    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
        // console.log(acceptedFiles)

        if (acceptedFiles?.length) {
            setFiles(previousFiles => [
                ...previousFiles,
                ...acceptedFiles.map(file =>
                    Object.assign(file, { preview: URL.createObjectURL(file) })
                )
            ])
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <form>
            <div {...getRootProps({
                className: className
            })}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Drop the files here ...</p> :
                        <p>Drag 'n' drop some files here, or click to select files</p>
                }
            </div>
            {/* Preview section */}
            <ul>
                {files.map(file => (
                    <li key={file.name}>
                        <Image src={file.preview} alt='' width={100} height={100} />
                    </li>
                ))}
            </ul>
        </form>
    )
}

export default Dropzone