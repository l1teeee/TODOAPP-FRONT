import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OtpInput } from "../otp-input";

test("renders boxes, advances focus and goes back on Backspace", async () => {
  const user = userEvent.setup();
  function Example() {
    const [value, setValue] = useState("");
    return <OtpInput length={4} value={value} onChange={setValue} />;
  }
  render(<Example />);
  const boxes = screen.getAllByRole("textbox");
  expect(boxes).toHaveLength(4);
  await user.click(boxes[0]);
  await user.keyboard("1");
  expect(boxes[1]).toHaveFocus();
  await user.keyboard("{Backspace}");
  expect(boxes[0]).toHaveFocus();
});

test("pasting a complete code sends all digits", () => {
  const onChange = jest.fn();
  render(<OtpInput length={4} value="" onChange={onChange} />);
  fireEvent.paste(screen.getByLabelText("Digit 1 of 4"), { clipboardData: { getData: () => "1234" } });
  expect(onChange).toHaveBeenCalledWith("1234");
});
