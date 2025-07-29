function doGet(e) {
      try {
          // Get data from URL parameter
          const encodedData = e.parameter.data;
          if (!encodedData) {
              throw new Error('No data provided');
          }

          // Decode the data
          const jsonString = decodeURIComponent(Utilities.newBlob(Utilities.base64Decode(encodedData)).getDataAsString());
          const data = JSON.parse(jsonString);

          // Create the document
          const doc = DocumentApp.create(data.title);
          const body = doc.getBody();

          // Set document margins and default styles
          const style = {};
          style[DocumentApp.Attribute.FONT_FAMILY] = 'Arial';
          style[DocumentApp.Attribute.FONT_SIZE] = 11;
          style[DocumentApp.Attribute.LINE_SPACING] = 1.5;
          body.setAttributes(style);

          // Add title
          const title = body.appendParagraph(data.title);
          title.setHeading(DocumentApp.ParagraphHeading.HEADING1);
          title.setSpacingAfter(12);

          // Add timestamp
          const timestamp = body.appendParagraph('Generated: ' + new Date().toLocaleString());
          timestamp.setFontSize(10);
          timestamp.setForegroundColor('#666666');
          timestamp.setSpacingAfter(20);

          // Add sections
          data.content.forEach((section, index) => {
              // Section header
              const sectionTitle = body.appendParagraph(`Section ${index + 1}: ${section.type}`);
              sectionTitle.setHeading(DocumentApp.ParagraphHeading.HEADING2);
              sectionTitle.setSpacingBefore(20);
              sectionTitle.setSpacingAfter(8);

              // Theme variant
              const themeText = body.appendParagraph(`Theme: ${section.variant}`);
              themeText.setFontSize(10);
              themeText.setForegroundColor('#666666');
              themeText.setSpacingAfter(12);

              // Section content - formatted as a table for better alignment
              const contentTable = body.appendTable();

              section.content.forEach(item => {
                  if (item.value) {
                      const row = contentTable.appendTableRow();

                      // Label cell
                      const labelCell = row.appendTableCell(item.label + ':');
                      labelCell.setWidth(120);
                      labelCell.setPaddingTop(4);
                      labelCell.setPaddingBottom(4);
                      labelCell.setAttributes({
                          [DocumentApp.Attribute.BOLD]: true,
                          [DocumentApp.Attribute.FONT_SIZE]: 10,
                          [DocumentApp.Attribute.FOREGROUND_COLOR]: '#444444'
                      });

                      // Value cell
                      const valueCell = row.appendTableCell(item.value);
                      valueCell.setPaddingTop(4);
                      valueCell.setPaddingBottom(4);
                      valueCell.setPaddingLeft(12);
                      valueCell.setAttributes({
                          [DocumentApp.Attribute.FONT_SIZE]: 11,
                          [DocumentApp.Attribute.LINE_SPACING]: 1.3
                      });
                  }
              });

              // Style the table
              contentTable.setBorderWidth(0);
              contentTable.setAttributes({
                  [DocumentApp.Attribute.MARGIN_LEFT]: 0,
                  [DocumentApp.Attribute.MARGIN_RIGHT]: 0
              });

              // Add spacing after section
              if (index < data.content.length - 1) {
                  const divider = body.appendHorizontalRule();
                  const spacer = body.appendParagraph('');
                  spacer.setSpacingBefore(12);
                  spacer.setSpacingAfter(12);
              }
          });

          // Get the URL and redirect to it
          const docUrl = doc.getUrl();

          // Return an HTML page that redirects to the document
          return HtmlService.createHtmlOutput(`
              <html>
                  <head>
                      <title>Creating Document...</title>
                      <meta http-equiv="refresh" content="0; url=${docUrl}">
                  </head>
                  <body>
                      <p>Creating your document... If you're not redirected, <a href="${docUrl}">click here</a>.</p>
                      <script>window.location.href = "${docUrl}";</script>
                  </body>
              </html>
          `);

      } catch (error) {
          // Return error page
          return HtmlService.createHtmlOutput(`
              <html>
                  <head><title>Error</title></head>
                  <body>
                      <h1>Error Creating Document</h1>
                      <p>${error.toString()}</p>
                      <p><button onclick="window.close()">Close Window</button></p>
                  </body>
              </html>
          `);
      }
  }