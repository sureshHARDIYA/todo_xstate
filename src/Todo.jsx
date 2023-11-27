import cn from "classnames";
import { useActor } from "@xstate/react";
import { useEffect, useRef } from "react";

// eslint-disable-next-line react/prop-types
export function Todo({ todoRef }) {
  const [state, send] = useActor(todoRef);
  const inputRef = useRef(null);
  const { id, title, completed } = state.context;

  useEffect(() => {
    if (state.actions.find((action) => action.type === "focusInput")) {
      inputRef.current && inputRef.current.select();
    }
  }, [state.actions, todoRef]);

  return (
    <li
      className={cn({
        editing: state.matches("editing"),
        completed
      })}
      data-todo-state={completed ? "completed" : "active"}
      key={id}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          onChange={() => {
            send("TOGGLE_COMPLETE");
          }}
          value={completed}
          checked={completed}
        />
        <label
          onDoubleClick={(e) => {
            send("EDIT");
          }}
        >
          {title}
        </label>{" "}
        <button className="destroy" onClick={() => send("DELETE")} />
      </div>
      <input
        className="edit"
        value={title}
        onBlur={(_) => send("BLUR")}
        onChange={(e) => send({ type: "CHANGE", value: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            send("COMMIT");
          }
          if (e.key === "Escape") {
            send("CANCEL");
          }
        }}
        ref={inputRef}
      />
    </li>
  );
}
