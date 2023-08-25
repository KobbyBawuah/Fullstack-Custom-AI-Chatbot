

const ModerationToggle = ({ moderation, setmoderation }) => {

    const toggleModeration = () => {
        setmoderation((prev) => !prev);
    };
    return (
        <div>
            <label
                htmlFor="moderationToggle"
                className="mr-2 text-sm text-gray-600"
            >
                Moderation
            </label>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                    type="checkbox"
                    id="moderationToggle"
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    checked={moderation}
                    onChange={toggleModeration}
                />
                <label
                    htmlFor="moderationToggle"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
            </div>
            <span className="text-sm text-gray-600">
                {moderation ? 'Enabled' : 'Disabled'}
            </span>
        </div>
    );
};

export default ModerationToggle;
