import React from "react";
import PSPDFKit from "pspdfkit";
import { getLicenseKey } from "./utils";

/**
 * The custom example is used to let a user open its own PDF with PSPDFKit for
 * Web Standalone.
 */
export default class CustomExample extends React.Component {
  async load() {
    const { customPdf } = this.props;
    if (this.props.currentBackend === "server") {
      const res = await fetch(`/api/instant/${customPdf}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        credentials: "same-origin"
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const response = await res.json();

      await PSPDFKit.load({
        serverUrl: response.serverUrl,
        instant: true,
        authPayload: {
          jwt: response.jwt
        },
        documentId: response.documentId,

        container: "#pspdfkit-container"
      });
    } else {
      await PSPDFKit.load({
        pdf: customPdf,
        licenseKey: getLicenseKey(),
        container: "#pspdfkit-container"
      });
    }
  }

  unload() {
    PSPDFKit.unload("#pspdfkit-container");
  }

  componentDidUpdate(prevProps) {
    if (prevProps.customPdf !== this.props.customPdf) {
      this.unload();
      this.load();
    }
  }

  componentDidMount() {
    this.load();
  }

  componentWillUnmount() {
    this.unload();
  }

  render() {
    return (
      <React.Fragment>
        <div
          id="pspdfkit-container"
          className="container"
          ref={this.container}
        />

        <style jsx>{`
          .container {
            height: 100%;
            width: 100%;
            background: #f6f8fa;
          }
        `}</style>
      </React.Fragment>
    );
  }
}
