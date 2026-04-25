import React, { useCallback } from "react";
import { debounce } from "../../../shared/utils/debounce";

function DebouncePage() {
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  }, []);

  const debouncedOnChange = debounce(onChange, 500);

  return (
    <section className="page narrow">
      <h2>Debounce</h2>
      <input
        style={{ border: "1px solid black" }}
        type="text"
        name="name"
        id=""
        onChange={debouncedOnChange}
      />
    </section>
  );
}

export default DebouncePage;
