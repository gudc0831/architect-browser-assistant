export type BrowserCaptureRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
  unit: "percent" | "px";
};

export type BrowserCaptureViewport = {
  width: number;
  height: number;
  devicePixelRatio: number;
};

export type BrowserCapturePayload = {
  dataUrl: string;
  cropDataUrl?: string;
  title: string;
  url: string;
  capturedAt: string;
  region: BrowserCaptureRegion;
  pixelRegion: BrowserCaptureRegion;
  viewport: BrowserCaptureViewport;
};

export type BrowserCaptureExtensionMessage = {
  type: "architect:capture-visible-tab";
  input: {
    region: BrowserCaptureRegion;
    pixelRegion: BrowserCaptureRegion;
    viewport: BrowserCaptureViewport;
  };
};
