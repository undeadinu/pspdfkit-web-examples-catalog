import ExampleList from "./example/list";
import React from "react";
import InstantButton from "./buttons/instant-button";
import StandaloneDocumentButton from "./buttons/standalone-document-button";

export default class Layout extends React.Component {
  state = { showMobileSidebar: false };

  _switchMobileBackend = nextBackend => {
    const { currentBackend, switchBackend } = this.props;
    // When clicking again on the current Backend in our switcher, we want to toggle the sidebar.
    if (currentBackend === nextBackend) {
      this.setState(prevState => {
        return { showMobileSidebar: !prevState.showMobileSidebar };
      });
    } else {
      this.setState({ showMobileSidebar: true });
    }
    if (currentBackend !== nextBackend) {
      switchBackend(nextBackend);
    }
  };

  _switchExample = nextExample => {
    // When switching examples, we want to hide the mobile sidebar
    this.setState({ showMobileSidebar: false });
    this.props.switchExample(nextExample);
  };

  _showCustomPdf = pdf => {
    // When opening a custom PDF, we want to hide the mobile sidebar
    this.setState({ showMobileSidebar: false });
    this.props.showCustomPdf(pdf);
  };

  render() {
    const {
      header,
      children,
      currentBackend,
      switchBackend,
      currentExample,
      serverDocumentId
    } = this.props;

    const { showMobileSidebar } = this.state;

    return (
      <div className={`layout ${showMobileSidebar ? "sidebar-open" : ""}`}>
        <header>
          <div className="logo">
            <img src="static/logo-light.png" />
          </div>
          <div className="switcher-mobile">
            <button
              className={currentBackend === "standalone" && "active"}
              onClick={() => this._switchMobileBackend("standalone")}
            >
              Standalone
            </button>
            <button
              className={currentBackend === "server" && "active"}
              onClick={() => this._switchMobileBackend("server")}
            >
              Server
            </button>
          </div>
        </header>
        <aside>
          <div className="top">
            <div className="logo">
              <img src="static/logo-dark.png" alt="PSPDFKit logo" />
            </div>
            {/* Only display the switcher when we are not showing a custom example */}
            {currentExample !== "custom" && (
              <div className="switcher">
                <strong className="current-backend">
                  {currentBackend === "server" ? "Server" : "Standalone"}
                </strong>
                {currentBackend === "server" ? (
                  <button onClick={() => switchBackend("standalone")}>
                    Switch to Standalone
                  </button>
                ) : (
                  <button onClick={() => switchBackend("server")}>
                    Switch to Server
                  </button>
                )}
              </div>
            )}
            {currentBackend === "standalone" ? (
              <p>
                The absence of a server component makes it easier to integrate
                this solution and allows you to rapidly deploy it into your
                existing website.
                <StandaloneDocumentButton showCustomPdf={this._showCustomPdf} />
              </p>
            ) : (
              <p>
                Our Server Backend is pre-rendering PDFs for optimal performance
                on all devices. It’s easy to deploy on your own environment.
                <br />
                <InstantButton
                  instantUrl={`${location.protocol}//${
                    location.host
                  }/api/instant/${serverDocumentId}`}
                />
              </p>
            )}
          </div>
          <div className="examples">
            <ExampleList
              currentExample={currentExample}
              switchExample={this._switchExample}
            />
          </div>
        </aside>
        <section>{children}</section>

        <style jsx global>{`
          body {
            background: #fff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
              Helvetica, Arial, sans-serif, "Apple Color Emoji",
              "Segoe UI Emoji", "Segoe UI Symbol";
            color: #32383e;
            font-size: 13px;
            line-height: 1.5em;
          }
          p {
            margin: 0;
            padding: 0;
          }
          a {
            color: #267ad3;
          }
          a:hover {
            color: #23527c;
          }
          button {
            color: #3e464d;
            background: #eff1f5;
            border: none;
            border-radius: 5px;
            font-weight: 500;
            padding: 10px 15px;
            margin-top: 10px;
            cursor: pointer;
            background: #eff1f5;
            text-align: center;
            cursor: pointer;
            font-size: 12px;
          }
          * {
            box-sizing: border-box;
          }
        `}</style>

        <style jsx>{`
          .layout {
            display: grid;
            height: 100vh;
            grid-template-columns: 1fr;
            grid-template-rows: 50px 1fr;
            grid-template-areas:
              "header"
              "content";
          }

          .layout.sidebar-open {
            grid-template-columns: none;
            grid-template-rows: none;
            grid-template-areas:
              "header header"
              "sidebar sidebar";
          }

          header {
            grid-area: header;
            width: 100%;
            background: #32383e;
            display: flex;
            justify-content: space-between;
            padding: 0 10px;
            height: 50px;
            align-items: center;
          }

          section {
            grid-area: content;
            width: 100%;
            height: 100%;
          }

          .logo img {
            height: 15px;
          }

          @media (min-width: 576px) {
            .logo img {
              height: 25px;
            }
          }

          aside {
            display: none;
          }

          .sidebar-open aside {
            display: block;
          }

          aside .logo {
            display: none;
          }

          aside .current-backend {
            font-weight: bold;
            font-size: 16px;
          }

          aside .top {
            padding: 20px;
            background: #fff;
            height: 190px;
            border-bottom: 1px #eee solid;
          }

          aside {
            height: calc(100vh - 50px);
            background: #edf0f5;
            grid-area: sidebar;
          }

          aside .switcher {
            display: none;
          }

          .switcher-mobile button {
            margin: 0;
            margin-left: 10px;
            color: #ced6e2;
            background: #3e464d;
            border: none;
          }

          .switcher-mobile button.active {
            background: #fff;
            color: #32383e;
          }

          .examples {
            overflow-y: auto;
            padding: 20px;
            max-height: calc(100vh - 50px - 190px);
            -webkit-overflow-scrolling: touch;
          }

          .sidebar-open section {
            display: none;
          }

          @media (min-width: 992px) {
            .layout.sidebar-open,
            .layout {
              display: grid;
              height: 100vh;
              grid-template-columns: 380px 1fr;
              grid-template-rows: 1fr;
              grid-template-areas: "sidebar content";
              grid-column-gap: 0px;
            }

            header {
              display: none;
            }

            aside .top {
              margin: -20px -20px 0 -20px;
              height: 220px;
              margin-bottom: 20px;
              box-shadow: 0px 0px 4px rgba(70, 78, 85, 0.1),
                0px 10px 20px rgba(70, 78, 85, 0.1);
            }

            aside .logo {
              margin: -20px 0 0 -20px;
              height: 50px;
              padding-left: 20px;
              display: flex;
              align-items: center;
            }

            aside .switcher {
              display: flex;
              flex-flow: row;
              align-items: center;
              justify-content: space-between;
              margin-top: 5px;
              margin-bottom: 5px;
            }

            aside .switcher button {
              background: #e8f0fb;
              margin: 0;
            }

            aside {
              width: 100%;
              height: 100%;
              max-height: 100%;
              display: flex;
              flex-direction: column;
              grid-area: sidebar;
              padding: 20px;
              border-right: 1px #e3e3e3 solid;
              position: relative;
            }

            .examples {
              padding: 0;
              margin: -10px -10px 0 -10px;
              overflow-y: auto;
              max-height: calc(100vh - 250px);
            }

            .sidebar-open section,
            section {
              display: block;
              overflow: hidden;
            }

            header {
              display: none;
            }
          }

          @media all and (-ms-high-contrast: none),
            (-ms-high-contrast: active),
            (min-width: 992px) {
            aside {
              -ms-grid-row: 2;
              -ms-grid-row-span: 0;
              -ms-grid-column: 0;
              -ms-grid-column-span: 0;
            }
            section {
              -ms-grid-row: 2;
              -ms-grid-row-span: 0;
              -ms-grid-column: 2;
              -ms-grid-column-span: 0;
            }
            header {
              -ms-grid-row: 1;
              -ms-grid-row-span: 0;
              -ms-grid-column: 1;
              -ms-grid-column-span: 2;
            }

            .layout.sidebar-open,
            .layout {
              display: -ms-grid;
              height: 100vh;
              -ms-grid-columns: 380px 1fr;
              -ms-grid-rows: 1fr;
            }
          }
        `}</style>
      </div>
    );
  }
}
