import React, { Component } from "react";
import ResetButton from "../buttons/reset-button";
import { load, unload } from "./utils";

export default class Example extends Component {
  containerRef = React.createRef();
  state = {
    error: null,
    serverDocument: null,
    instantUrl: null,
    showToolbarPreview: true
  };

  async componentDidUpdate(prevProps) {
    // We only need to update the PSPDFKit viewer when we switch between
    // different PSPDFKit backend options. All other updates can be
    // ignored.
    if (prevProps.currentBackend !== this.props.currentBackend) {
      const { name, hooks, currentBackend } = this.props;
      const containerRef = this.containerRef.current;

      containerRef && unload(containerRef, hooks.unload);

      try {
        this.setState({ showToolbarPreview: true });
        await load(containerRef, name, currentBackend, hooks.load);
        this.setState({ showToolbarPreview: false });
      } catch (error) {
        this.setState({ error: error.message });
      }
    }
  }

  async componentDidMount() {
    // If the user clicks a link to the example which is already open, the
    // default route would overwrite our custom search params.

    const { name, hooks, currentBackend } = this.props;
    const containerRef = this.containerRef.current;

    containerRef && unload(containerRef, hooks.unload);

    try {
      this.setState({ showToolbarPreview: true });
      await load(containerRef, name, currentBackend, hooks.load);
      this.setState({ showToolbarPreview: false });
    } catch (error) {
      console.error(error);
    }
  }

  componentWillUnmount() {
    const { hooks } = this.props;
    const containerRef = this.containerRef.current;

    containerRef && unload(containerRef, hooks.unload);
    this.setState({ showToolbarPreview: true });
  }

  render() {
    const { error } = this.state;

    let optionalErrorMessage = null;
    if (error) {
      optionalErrorMessage = (
        <div>
          <p>{error}</p>
          <ResetButton />
        </div>
      );
    }

    return (
      <div className="catalog-example">
        {this.state.showToolbarPreview && <div className="toolbar-preview" />}
        {optionalErrorMessage}
        <div className="container" ref={this.containerRef} />

        <style jsx>{`
          .container {
            height: 100%;
            background: #f6f8fa;
          }

          .toolbar-preview {
            width: 100%;
            height: 48px;
            position: absolute;
            background: #3d464c;
            top: 0;
          }

          .catalog-example {
            position: relative;
            background: #fff;
            width: 100%;
            height: 100%;
            box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
          }
        `}</style>
      </div>
    );
  }
}
