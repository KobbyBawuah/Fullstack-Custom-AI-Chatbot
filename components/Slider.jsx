import { Fragment } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid'


const WorkflowSlider = ({ open, setOpen }) => {
    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-500"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-500"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                                            <button
                                                type="button"
                                                className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                                onClick={() => setOpen(false)}
                                            >
                                                <span className="absolute -inset-2.5" />
                                                <span className="sr-only">Close panel</span>
                                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                        <div className="px-4 sm:px-6">
                                            <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                                                <strong>Streamlined Workflow for Training Your Chat Bot: </strong>
                                            </Dialog.Title>
                                        </div>
                                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                            <ol className="list-decimal pl-6 space-y-2">
                                                <p className="text-gray-800">
                                                    <li>
                                                        <strong>Utilize Existing Knowledge Base: </strong>
                                                        Upon Load, if you've previously trained your chat bot and it exists, you can simply choose the option with the data base symbol. You can update that knowledge base by clicking on the arrow at the bottom of that button. If you wish to delete the knowledge base, click on the trash can.
                                                    </li>
                                                </p>
                                                <p className="text-gray-800">
                                                    <li>
                                                        <strong>Training with New Data: </strong>
                                                        Should you opt to train your chat bot with fresh data, click on the appropriate chat bot with a plus symbol. It should open the Setup view. Uploading your relevant documents by clicking or draging and dropping the appropriate files into the Upload files field. For your convenience, a preview section is available to review the acceptable documents.
                                                    </li>
                                                </p>
                                                <p className="text-gray-800">
                                                    <li>
                                                        <strong>Refining Your Selections: </strong>
                                                        The option to "remove all previewed files" or individual files are at your disposal. This step allows you to make informed decisions about the materials you intend to include.
                                                    </li>
                                                </p>
                                                <p className="text-gray-800">
                                                    <li>
                                                        <strong>Initiating File Processing: </strong>
                                                        Once you are satisfied with your chosen documents, proceed by clicking the "send files for processing" button. This action prompts the chat bot to securely store the uploaded files within the backend system.
                                                    </li>
                                                </p>
                                                <p className="text-gray-800">
                                                    <li>
                                                        <strong>Continuous Document Addition: </strong>
                                                        Should you wish to augment your sent data further, you can simply add new files and send them to the back end. Begin by clearing the existing previewed files, then select and send additional files for processing. Don't worry, the system is smart enough not to accept two files with the same name.
                                                    </li>
                                                </p>
                                                <p className="text-gray-800">
                                                    <li>
                                                        <strong>Effortless Data Removal: </strong>
                                                        For comprehensive control, the option to "Delete all sent files" is accessible. This feature empowers you to clear all currently saved data with ease.
                                                    </li>
                                                </p>
                                                <p className="text-gray-800">
                                                    <li>
                                                        <strong>Creating Your Custom Knowledge Base: </strong>
                                                        The time arrives to craft your personalized chat bot. By selecting "Create your XXX knowledge base" located at the bottom of the page, the system initiates the learning process. Once completed, your chat bot emerges and is ready for interaction.
                                                    </li>
                                                </p>
                                                <p className="text-gray-800">
                                                    <li>
                                                        <strong>Moderation: </strong>
                                                        You have the ability to use the chatbot in a moderated state. It avoids askin the bot questions is the questions are not appropriate according to OpenAI's standard.
                                                    </li>
                                                </p>
                                            </ol>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default WorkflowSlider;
