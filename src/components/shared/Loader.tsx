import { CircularProgress } from "@mui/material";

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <CircularProgress size="8rem" />
    </div>
  );
}
