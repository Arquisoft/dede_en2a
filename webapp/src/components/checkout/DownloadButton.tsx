import { Button } from "@mui/material";
import { checkPDF } from "../../helpers/ImageHelper";

export default function DownloadButtton(props: any) {
  const onDownload = () => {
    const link = document.createElement("a");
    link.download = checkPDF(props.pdf + ".pdf");
    link.href = checkPDF(props.pdf + ".pdf");
    link.click();
  };

  return (
    <Button onClick={onDownload} variant="contained" color="primary">
      Download PDF
    </Button>
  );
}
