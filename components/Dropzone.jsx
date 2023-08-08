'use client'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/solid'


const Dropzone = ({ className }) => {
    const [files, setFiles] = useState([])
    const [rejected, setRejected] = useState([])

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
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

        if (rejectedFiles?.length) {
            setRejected(previousFiles => [...previousFiles, ...rejectedFiles])
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'text/markdown': ['.md'],
            'text/plain': ['.txt', '.text'],
        }
    })

    useEffect(() => {
        // Revoke the data uris to avoid memory leaks
        return () => files.forEach(file => URL.revokeObjectURL(file.preview))
    }, [files])

    const removeFile = name => {
        setFiles(files => files.filter(file => file.name !== name))
    }

    const removeAll = () => {
        setFiles([])
        setRejected([])
    }

    const removeRejected = name => {
        setRejected(files => files.filter(({ file }) => file.name !== name))
    }

    const onSubmit = async e => {
        e.preventDefault()
        if (!files?.length) return

        try {
            const formData = new FormData()
            files.forEach(file => formData.append('file', file))
            formData.append('upload_preset', 'friendsbook')

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
            // handle the error
            if (!res.ok) throw new Error(await res.text())
        } catch (e) {
            // Handle errors here
            console.error(e)
        }
    }

    async function deleteAllFiles() {
        try {
            const result = await fetch('/api/delete', {
                method: 'POST',
            });

            const json = await result.json();
            console.log('Files deletion result:', json);

            // Assuming the server returns { success: true } on successful deletion
            if (json.success) {
                console.log('All files have been deleted.');
            } else {
                console.error('Error deleting files:', json.error);
            }
        } catch (err) {
            console.error('Error deleting files:', err);
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <div {...getRootProps({
                className: className
            })}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Drop the files here ...</p> :
                        <p>Drag 'n' drop some files here, or click this area to select files</p>
                }
            </div>

            {/* Preview */}
            <section className='mt-10'>
                <div className='flex gap-4'>
                    <h2 className='title text-3xl font-semibold tracking-wide'>Preview</h2>
                </div>
                {/* Accepted files */}
                <h3 className='title text-lg font-semibold text-neutral-600 mt-10 border-b pb-3'>
                    Accepted Files
                </h3>
                <ul className='mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10'>
                    {files.map(file => (
                        <li key={file.name} className='relative h-32 rounded-md shadow-lg'>
                            <Image
                                src={file.preview}
                                alt={file.name}
                                width={100}
                                height={100}
                                onLoad={() => {
                                    URL.revokeObjectURL(file.preview)
                                }}
                                className='h-full w-full object-contain rounded-md'
                            />
                            <button
                                type='button'
                                className='w-7 h-7 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 hover:bg-white transition-colors'
                                onClick={() => removeFile(file.name)}
                            >
                                <XMarkIcon className='w-5 h-5 fill-white hover:fill-secondary-400 transition-colors' />
                            </button>
                            <p className='mt-2 text-neutral-500 text-[12px] font-medium'>
                                {file.name}
                            </p>
                        </li>
                    ))}
                </ul>

                {/* Rejected Files */}
                <h3 className='title text-lg font-semibold text-neutral-600 mt-24 border-b pb-3'>
                    Rejected Files
                </h3>
                <ul className='mt-6 flex flex-col'>
                    {rejected.map(({ file, errors }) => (
                        <li key={file.name} className='flex items-start justify-between'>
                            <div>
                                <p className='mt-2 text-neutral-500 text-sm font-medium'>
                                    {file.name}
                                </p>
                                <ul className='text-[12px] text-red-400'>
                                    {errors.map(error => (
                                        <li key={error.code}>{error.message}</li>
                                    ))}
                                </ul>
                            </div>
                            <button
                                type='button'
                                className='mt-1 py-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-secondary-400 rounded-md px-3 hover:bg-secondary-400 hover:text-white transition-colors'
                                onClick={() => removeRejected(file.name)}
                            >
                                remove
                            </button>
                        </li>
                    ))}
                </ul>

                <div className='flex gap-4 mt-6'>
                    <button
                        type='button'
                        onClick={removeAll}
                        className='mt-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-purple-400 rounded-md px-3 hover:bg-purple-400 hover:text-white transition-colors'
                    >
                        Remove all previewed files
                    </button>
                    <button
                        type='submit'
                        className='ml-auto mt-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-purple-400 rounded-md px-3 hover:bg-purple-400 hover:text-white transition-colors'
                    >
                        Send Files for processing
                    </button>
                    <button
                        type='button'
                        onClick={deleteAllFiles}
                        className='ml-auto mt-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-purple-400 rounded-md px-3 hover:bg-purple-400 hover:text-white transition-colors'
                    >
                        Delete all sent files
                    </button>
                </div>
            </section>
        </form >
    )
}

export default Dropzone