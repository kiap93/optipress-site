/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ToolPage from "./pages/ToolPage";
import PdfCompressPage from "./pages/PdfCompressPage";
import PricingPage from "./pages/PricingPage";

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ToolPage />} />
          <Route path="/compress-image" element={<ToolPage />} />
          <Route path="/compress-pdf" element={<PdfCompressPage />} />
          <Route path="/compress-pdf-to-1mb" element={<PdfCompressPage />} />
          <Route path="/compress-pdf-for-email" element={<PdfCompressPage />} />
          <Route path="/compress-image-to-100kb" element={<ToolPage />} />
          <Route path="/png-to-webp" element={<ToolPage />} />
          <Route path="/jpg-to-png" element={<ToolPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="*" element={<ToolPage />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
