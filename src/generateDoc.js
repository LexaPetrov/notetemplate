import { Document, Paragraph, TextRun, UnderlineType } from "docx";
import locale from "date-fns/esm/locale/ru";

export const generateDocFile = (state, bodyState) => {
  let docBody =
    state.theme === "О замене преподавателя"
      ? generteSubstitutingBody(bodyState)
      : generateRescheduleBody(bodyState);

  console.log(docBody);
  let doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: "Common1",
          name: "Common 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            font: "Times New Roman",
            size: 28
          }
        }
      ]
    },
    numbering: {
      config: [
        {
          reference: "concrete",
          levels: [
            {
              level: 0,
              format: "decimal",
              text: "%1.",
              style: {
                paragraph: {
                  indent: { left: 720, hanging: 360 }
                }
              }
            }
          ]
        }
      ]
    }
  });

  doc.addSection({
    properties: {
      left: 1700,
      right: 850
    },
    children: [
      new Paragraph({
        style: "Common1",
        children: [
          new TextRun({
            text: " ",
            size: 24
          })
        ]
      }),
      new Paragraph({
        style: "Common1",
        children: [
          new TextRun({
            text: " ",
            size: 24
          })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "СЛУЖЕБНАЯ ЗАПИСКА\n",
            bold: true,
            size: 32,
            font: {
              name: "Times New Roman"
            }
          })
        ]
      }),
      new Paragraph({
        style: "Common1",
        children: [
          new TextRun({
            text: " ",
            size: 32
          })
        ]
      }),
      new Paragraph({
        style: "Common1",
        children: [
          new TextRun({
            text: "Кому: ",
            bold: true
          }),
          new TextRun({
            text: state.to + " " + state.toName
          })
        ]
      }),
      new Paragraph({
        style: "Common1",
        children: [
          new TextRun({
            text: "От кого: ",
            bold: true
          }),
          new TextRun({
            text: state.from + " " + state.fromName
          })
        ]
      }),
      new Paragraph({
        style: "Common1",
        children: [
          new TextRun({
            text: "Дата: ",
            bold: true
          }),
          new TextRun({
            bold: true,
            text: state.date.toLocaleString().split(",")[0]
          })
        ]
      }),
      new Paragraph({
        style: "Common1",
        children: [
          new TextRun({
            text: "Тема: ",
            bold: true
          }),
          new TextRun({
            bold: true,
            text: state.theme
          })
        ]
      }),
      new Paragraph({
        style: "Common1",
        children: [
          new TextRun({
            text:
              "_____________________________________________________________________________",
            size: 24
          })
        ]
      }),
      new Paragraph({
        style: "Common1",
        children: [
          new TextRun({
            text: " ",
            size: 24
          })
        ]
      }),
      ...docBody,
      new Paragraph({
        style: "Common1",
        text: " "
      }),
      new Paragraph({
        style: "Common1",
        children: [
          new TextRun({
            text: state.footerWho + "						" + state.footerWhoName
          })
        ]
      })
    ]
  });

  return doc;
};

const generteSubstitutingBody = state => {
  return [
    new Paragraph({
      style: "Common1",
      indent: {
        hanging: -300
      },
      children: [
        new TextRun({
          text:
            "В связи с " +
            state.reason +
            " прошу осуществить замену занятий " +
            state.post +
            " " +
            state.name +
            "."
        })
      ]
    }),
    ...state.days.flatMap(day => {
      return [
        new Paragraph({
          style: "Common1",
          indent: {
            hanging: -300
          },
          children: [
            new TextRun({
              text: day.date.toLocaleString().split(",")[0],
              bold: true,
              underline: {
                type: UnderlineType.SINGLE
              }
            })
          ]
        }),
        new Paragraph({
          style: "Common1",
          indent: {
            hanging: -300
          },
          children: [
            new TextRun({
              text:
                day.type +
                ' по дисциплине "' +
                day.discipline +
                '" (гр. ' +
                day.group +
                ", " +
                locale.localize.day(day.date.getDay()) +
                ", " +
                day.class +
                " пара) " +
                day.substitutesName
            })
          ]
        }),
        new Paragraph({
          style: "Common1",
          text: " "
        })
      ];
    })
  ];
};

const generateRescheduleBody = state => {
  return [
    new Paragraph({
      indent: {
        hanging: -300
      },
      style: "Common1",
      children: [
        new TextRun({
          text:
            "В связи с " +
            state.rescheduleReason +
            " у " +
            state.reschedulePost +
            " " +
            state.rescheduleName +
            " прошу " +
            state.rescheduleHeaderDays
              .map(day => day.toLocaleString().split(",")[0])
              .join(", ") +
            " перенести занятия по следующим дисциплинам:"
        })
      ]
    }),
    ...state.rescheduleMainComponents.flatMap(day => {
      return [
        new Paragraph({
          style: "Common1",
          numbering: {
            reference: "concrete",
            level: 0,
            custom: true
          },
          children: [
            new TextRun({
              text:
                day.type +
                ' по дисциплине "' +
                day.discipline +
                '" (гр. ' +
                day.group +
                ", " +
                locale.localize.day(day.date.getDay()) +
                ", " +
                day.date.toLocaleString().split(",")[0] +
                ", " +
                day.class +
                " пара) будет перенесено на " +
                locale.localize.day(day.newDate.getDay()) +
                ", " +
                day.newDate.toLocaleString().split(",")[0] +
                ", " +
                day.newClass +
                " пара, ауд. " +
                day.room,
              size: 28,
              font: {
                name: "Times New Roman"
              }
            })
          ]
        })
      ];
    }),
    new Paragraph({
      style: "Common1",
      text: " "
    })
  ];
};
