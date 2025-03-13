
import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { CreditCard, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { encodeVoterForQR } from "@/utils/qrCodeUtils";

interface VoterQRCodeProps {
  voterId: string;
  voterName?: string;
  algoAddress: string;
  onPrint?: () => void;
  onDownload?: () => void;
}

const VoterQRCode: React.FC<VoterQRCodeProps> = ({
  voterId,
  voterName = "Registered Voter",
  algoAddress,
  onPrint,
  onDownload
}) => {
  // Create encoded data for QR code using our utility function
  const qrData = encodeVoterForQR({
    voterId,
    algoAddress,
    algoMnemonic: "" // We don't include the mnemonic in the QR code for security
  });

  // Function to handle printing
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      const printWindow = window.open('', '', 'height=500,width=500');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Voter ID Card</title>');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<div style="display: flex; flex-direction: column; align-items: center; padding: 20px; border: 2px solid #000; max-width: 320px; margin: 0 auto;">');
        printWindow.document.write(`<h2 style="margin-bottom: 10px;">Voter ID Card</h2>`);
        printWindow.document.write(`<p style="margin: 5px 0;"><strong>ID:</strong> ${voterId}</p>`);
        printWindow.document.write(`<p style="margin: 5px 0;"><strong>Name:</strong> ${voterName}</p>`);
        printWindow.document.write('<div style="margin: 15px 0;">');
        printWindow.document.write(document.getElementById('voter-qrcode')?.innerHTML || '');
        printWindow.document.write('</div>');
        printWindow.document.write(`<p style="font-size: 10px; margin-top: 10px;">Secured with quantum-resistant cryptography</p>`);
        printWindow.document.write('</div></body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  // Function to handle download
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      const canvas = document.getElementById('voter-qrcode')?.querySelector('canvas');
      if (canvas) {
        const url = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.download = `voter-id-${voterId}.png`;
        link.href = url;
        link.click();
      }
    }
  };

  return (
    <Card className="max-w-md mx-auto border-2 border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Voter ID Card</CardTitle>
            <CardDescription>Quantum-Secured Identity</CardDescription>
          </div>
          <CreditCard className="h-8 w-8 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center pb-2">
        <div className="p-2 bg-white rounded-md shadow-sm" id="voter-qrcode">
          <QRCodeSVG 
            value={qrData}
            size={180}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: "/favicon.ico",
              excavate: true,
              height: 24,
              width: 24
            }}
          />
        </div>
        <div className="w-full mt-4 space-y-2">
          <div className="flex justify-between px-1">
            <span className="text-sm font-medium">Voter ID:</span>
            <span className="text-sm font-mono">{voterId}</span>
          </div>
          <div className="flex justify-between px-1">
            <span className="text-sm font-medium">Name:</span>
            <span className="text-sm">{voterName}</span>
          </div>
          <div className="flex justify-between px-1">
            <span className="text-sm font-medium">Generated:</span>
            <span className="text-sm">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" onClick={handlePrint} className="flex items-center">
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button variant="secondary" onClick={handleDownload} className="flex items-center">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VoterQRCode;
