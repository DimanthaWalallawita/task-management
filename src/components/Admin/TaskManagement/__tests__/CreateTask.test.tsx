import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateTask from "../CreateTask"; 
import axios from "../../../../__mocks__/axios";
import { message } from "antd";

jest.mock("axios");

describe("CreateTask Component", () => {
  it("fills the form and submits task successfully", async () => {
    // Mock users API response
    axios.get.mockResolvedValueOnce({
      data: [
        { id: "1", fullName: "Dimantha Walallawita" },
        { id: "2", fullName: "John Doe" },
      ],
    });

    // Mock post request
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    // Render the component
    render(<CreateTask />);

    // Wait for the Select component to be rendered
    const selectElement = await screen.findByRole("combobox");
    fireEvent.mouseDown(selectElement);

    // Check for user "Dimantha Walallawita"
    const option = await screen.findByText("Dimantha Walallawita");
    expect(option).toBeInTheDocument();

    fireEvent.click(option);

    // Fill out the form fields
    fireEvent.change(screen.getByPlaceholderText("Enter task name"), {
      target: { value: "Test Task" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter task description"), {
      target: { value: "Test Description" },
    });

    fireEvent.click(screen.getByText("Create Task"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:8000/api/task/create",
        expect.objectContaining({
          taskName: "Test Task",
          description: "Test Description",
          assignedTo: "1", // assuming "Dimantha" has id 1
        })
      );
    });

    expect(message.success).toHaveBeenCalledWith("Task created successfully");
  });
});
