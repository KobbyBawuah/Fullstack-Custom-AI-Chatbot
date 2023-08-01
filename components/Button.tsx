// components/MyButton.js
function MyButton() {
  const handleClick = () => {
    // Some event handling logic
  };

  return (
    <button type="button" className="some-button" onClick={() => {
      fetch('/api/sentry-example-api')
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
    }}>
      Click Me
    </button>
  );
}

export default MyButton;
