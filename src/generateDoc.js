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
    }
  });

  doc.addSection({
    properties: {
      left: 1700,
      right: 850
    },
    children: [
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
            text: " "
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
            text: state.to + " " + state.fromName
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

const generateRescheduleBody = (doc, state) => {
  return [];
};
