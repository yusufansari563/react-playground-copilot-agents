import React, { useCallback } from "react";
import { throttle } from "../../../shared/utils/throttle";

function ThrottlePage() {
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  }, []);

  const throttledOnChange = throttle(onChange, 500);

  return (
    <section className="page narrow">
      <h2>Throttle</h2>
      <input
        style={{ border: "1px solid black" }}
        type="text"
        name="name"
        id=""
        onChange={throttledOnChange}
      />
      {/* <button onClick={() => console.log("Button clicked")} disabled={throttledOnClick}>Click me</button> */}
    </section>
  );
}

export default ThrottlePage;
