import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusCard } from "./StatusCard";

const meta = {
  title: "Shared/StatusCard",
  component: StatusCard,
  args: {
    title: "Learning Track",
    body: "This story verifies baseline Storybook wiring and component variants.",
  },
} satisfies Meta<typeof StatusCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};

export const Success: Story = {
  args: {
    tone: "success",
  },
};

export const Warning: Story = {
  args: {
    tone: "warning",
  },
};
