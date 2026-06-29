(function(){
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
const {
  useState,
  useRef,
  useEffect,
  memo
} = React;
const INDOOR_FIELDS = [{
  code: "b1",
  label: "吸込温度",
  unit: "°C",
  step: 0.1,
  group: "indoor"
}, {
  code: "b2",
  label: "吹出温度",
  unit: "°C",
  step: 0.1,
  group: "indoor"
}, {
  code: "b3",
  label: "室内熱交・入口",
  unit: "°C",
  step: 0.1,
  group: "indoor"
}, {
  code: "b4",
  label: "室内熱交・中間",
  unit: "°C",
  step: 0.1,
  group: "indoor"
}, {
  code: "b5",
  label: "室内熱交・出口",
  unit: "°C",
  step: 0.1,
  group: "indoor"
}, {
  code: "b6",
  label: "膨張弁開度",
  unit: "pulse",
  step: 1,
  group: "indoor"
}, {
  code: "b8",
  label: "リモコン感知",
  unit: "°C",
  step: 0.1,
  group: "indoor"
}];
const OUTDOOR_FIELDS = [{
  code: "E1",
  label: "吐出ガス温度",
  unit: "°C",
  step: 0.1,
  group: "outdoor"
}, {
  code: "E2",
  label: "吸入ガス温度",
  unit: "°C",
  step: 0.1,
  group: "outdoor"
}, {
  code: "E3",
  label: "室外熱交・蒸発",
  unit: "°C",
  step: 0.1,
  group: "outdoor"
}, {
  code: "E4",
  label: "圧縮機頂部",
  unit: "°C",
  step: 0.1,
  group: "outdoor"
}, {
  code: "F1",
  label: "外気温度",
  unit: "°C",
  step: 0.1,
  group: "outdoor"
}, {
  code: "F2",
  label: "過冷却液温度",
  unit: "°C",
  step: 0.1,
  group: "outdoor"
}, {
  code: "F3",
  label: "室外熱交・出口",
  unit: "°C",
  step: 0.1,
  group: "outdoor"
}, {
  code: "H1",
  label: "高圧圧力",
  unit: "MPa",
  step: 0.01,
  group: "outdoor"
}, {
  code: "H2",
  label: "低圧圧力",
  unit: "MPa",
  step: 0.01,
  group: "outdoor"
}, {
  code: "H3",
  label: "運転電流",
  unit: "A",
  step: 0.1,
  group: "outdoor"
}, {
  code: "H4",
  label: "運転周波数",
  unit: "Hz",
  step: 1,
  group: "outdoor"
}];
const ALL_FIELDS = [...INDOOR_FIELDS, ...OUTDOOR_FIELDS];
const defVis = () => {
  const v = {};
  ALL_FIELDS.forEach(f => v[f.code] = true);
  return v;
};
const defLim = () => {
  const v = {};
  ALL_FIELDS.forEach(f => v[f.code] = {
    enabled: false,
    min: "",
    max: ""
  });
  return v;
};
const emptyVal = () => {
  const v = {};
  ALL_FIELDS.forEach(f => v[f.code] = "");
  return v;
};
const emptyForm = (inspector = "", date = "") => ({
  floor: "",
  room: "",
  managementNo: "",
  unitNo: "",
  inspectionDate: date || new Date().toISOString().slice(0, 10),
  inspector,
  preOperation: "",
  preMode: "",
  preWind: "",
  preSetTemp: "",
  values: emptyVal(),
  remarks: ""
});
function isAbn(code, val, limits) {
  const v = parseFloat(val);
  if (val === "" || isNaN(v)) return false;
  const l = limits[code];
  if (!l || !l.enabled) return false;
  if (l.min !== "" && !isNaN(parseFloat(l.min)) && v < parseFloat(l.min)) return true;
  if (l.max !== "" && !isNaN(parseFloat(l.max)) && v > parseFloat(l.max)) return true;
  return false;
}
function parseDevCSV(text) {
  return text.trim().split(/\r?\n/).slice(1).map(line => {
    const c = line.split(",").map(s => s.trim().replace(/^"|"$/g, ""));
    return {
      floor: c[0] || "",
      room: c[1] || "",
      managementNo: c[2] || "",
      unitNo: c[3] || ""
    };
  }).filter(r => r.managementNo || r.unitNo);
}
function parseInspCSV(text) {
  return text.trim().split(/\r?\n/).map(l => l.trim().replace(/^"|"$/g, "")).filter(Boolean);
}
function doExport(records, visibility) {
  const vf = ALL_FIELDS.filter(f => visibility[f.code]);
  const rows = [["点検日", "点検者", "階", "部屋名", "管理番号", "機器番号", "運転", "モード", "設定温度", ...vf.map(f => f.code + "(" + f.unit + ")"), "備考"], ...records.map(r => [r.inspectionDate, r.inspector, r.floor, r.room, r.managementNo, r.unitNo, r.preOperation || "", r.preMode || "", r.preSetTemp || "", ...vf.map(f => r.values[f.code]), r.remarks])];
  const tsv = rows.map(r => r.map(c => '"' + String(c ?? "").replace(/"/g, '""') + '"').join("\t")).join("\n");
  const blob = new Blob(["\uFEFF" + tsv], {
    type: "text/tab-separated-values;charset=utf-8;"
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "ac_check_" + new Date().toISOString().slice(0, 10) + ".tsv";
  a.click();
}
const PS = "@media print{body>*{display:none!important;}#print-area{display:block!important;position:static!important;}@page{size:A4 landscape;margin:10mm;}}";
const C = {
  navy: "#1B3A6B",
  blue: "#2563B0",
  teal: "#0D7A6B",
  green: "#059669",
  red: "#DC2626",
  purple: "#7C3AED",
  g50: "#F8FAFC",
  g100: "#F1F5F9",
  g200: "#E2E8F0",
  g300: "#CBD5E1",
  g400: "#94A3B8",
  g500: "#64748B",
  g600: "#475569",
  g800: "#1E293B",
  white: "#FFFFFF",
  inp: "#F7F9FC"
};
const FieldRow = memo(function FR({
  f,
  isIn,
  idx,
  active,
  val,
  abn,
  dimmed,
  onClick,
  fRef
}) {
  const fill = val !== "";
  return /*#__PURE__*/_jsxDEV("tr", {
    ref: fRef,
    onClick: onClick,
    style: {
      background: active ? "linear-gradient(90deg,#2563B022,#2563B00A)" : abn ? "#FEF2F2" : dimmed ? "#F5F7FA" : idx % 2 === 0 ? C.white : C.g50,
      cursor: "pointer",
      outline: active ? "2px solid " + C.blue : "none",
      outlineOffset: -1,
      opacity: dimmed ? 0.45 : 1
    },
    children: [/*#__PURE__*/_jsxDEV("td", {
      style: {
        width: 5,
        padding: 0,
        background: active ? C.blue : abn ? C.red : "transparent",
        borderBottom: active ? "2px solid " + C.blue : "1px solid " + C.g100
      }
    }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
      style: {
        padding: active ? "18px 10px" : "9px 8px",
        fontFamily: "monospace",
        fontWeight: 700,
        fontSize: active ? 20 : 13,
        color: active ? C.blue : isIn ? C.blue : C.teal,
        borderBottom: active ? "2px solid " + C.blue : "1px solid " + C.g100,
        whiteSpace: "nowrap"
      },
      children: f.code
    }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
      style: {
        padding: active ? "18px 10px" : "9px 8px",
        fontSize: active ? 18 : 13,
        color: active ? C.navy : abn ? C.red : C.g600,
        fontWeight: active ? 700 : 400,
        borderBottom: active ? "2px solid " + C.blue : "1px solid " + C.g100
      },
      children: [f.label, abn && /*#__PURE__*/_jsxDEV("span", {
        style: {
          marginLeft: 4,
          fontSize: 9,
          background: C.red,
          color: C.white,
          padding: "1px 4px",
          borderRadius: 3,
          fontWeight: 700
        },
        children: "⚠️"
      }, void 0, false)]
    }, void 0, true), /*#__PURE__*/_jsxDEV("td", {
      style: {
        padding: active ? "18px 6px" : "9px 6px",
        fontSize: active ? 14 : 11,
        color: C.g400,
        borderBottom: active ? "2px solid " + C.blue : "1px solid " + C.g100,
        textAlign: "center",
        whiteSpace: "nowrap"
      },
      children: f.unit
    }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
      style: {
        padding: active ? "10px 8px" : "4px 7px",
        borderBottom: active ? "2px solid " + C.blue : "1px solid " + C.g100,
        width: 110
      },
      children: /*#__PURE__*/_jsxDEV("div", {
        style: {
          padding: active ? "12px 14px" : "6px 10px",
          borderRadius: 8,
          fontSize: active ? 26 : 14,
          fontFamily: "monospace",
          textAlign: "right",
          fontWeight: 800,
          border: "2px solid " + (active ? C.blue : fill ? C.green : C.g200),
          background: active ? "#EFF6FF" : fill ? "#F0FDF4" : C.white,
          color: abn ? C.red : fill ? C.g800 : C.g300,
          minHeight: active ? 52 : 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end"
        },
        children: fill ? val : active ? /*#__PURE__*/_jsxDEV("span", {
          style: {
            color: C.blue + "80",
            fontSize: 18
          },
          children: "—"
        }, void 0, false) : "—"
      }, void 0, false)
    }, void 0, false)]
  }, void 0, true);
});
function Numpad({
  display,
  onPress,
  onConfirm,
  canConfirm,
  onPrev,
  onNext,
  canPrev,
  canNext
}) {
  const KEYS = [[7, 8, 9], [4, 5, 6], [1, 2, 3], [0, "."]];
  const kb = {
    flex: 1,
    padding: 0,
    height: 68,
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    fontWeight: 800,
    fontFamily: "monospace",
    fontSize: 26,
    background: C.white,
    color: C.g800,
    boxShadow: "0 2px 6px rgba(0,0,0,0.10)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };
  const nb = en => ({
    flex: 1,
    height: 60,
    borderRadius: 12,
    border: "2px solid " + (en ? C.blue : C.g200),
    cursor: en ? "pointer" : "not-allowed",
    fontSize: 24,
    fontWeight: 800,
    background: en ? C.blue + "15" : C.g50,
    color: en ? C.blue : C.g300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  });
  return /*#__PURE__*/_jsxDEV("div", {
    style: {
      width: 260,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      background: C.g50,
      borderLeft: "2px solid " + C.g200,
      padding: "8px 8px 10px",
      gap: 6
    },
    children: [/*#__PURE__*/_jsxDEV("div", {
      style: {
        background: C.white,
        borderRadius: 12,
        padding: "8px 12px",
        border: "2px solid " + C.blue,
        minHeight: 58,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      },
      children: [/*#__PURE__*/_jsxDEV("div", {
        style: {
          fontSize: 10,
          fontWeight: 700,
          color: C.g400,
          letterSpacing: "0.04em"
        },
        children: "入力値"
      }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
        style: {
          fontFamily: "monospace",
          fontSize: 32,
          fontWeight: 800,
          color: display ? C.navy : C.g300,
          textAlign: "right",
          lineHeight: 1.1
        },
        children: display || /*#__PURE__*/_jsxDEV("span", {
          style: {
            color: C.g200
          },
          children: "—"
        }, void 0, false)
      }, void 0, false)]
    }, void 0, true), KEYS.map((row, ri) => /*#__PURE__*/_jsxDEV("div", {
      style: {
        display: "flex",
        gap: 6
      },
      children: row.map(k => /*#__PURE__*/_jsxDEV("button", {
        onClick: () => onPress(k),
        style: {
          ...kb,
          flex: ri === 3 && k === 0 ? 2 : 1
        },
        children: k
      }, k, false))
    }, ri, false)), /*#__PURE__*/_jsxDEV("button", {
      onClick: onConfirm,
      disabled: !canConfirm,
      style: {
        height: 64,
        borderRadius: 12,
        border: "none",
        cursor: canConfirm ? "pointer" : "not-allowed",
        fontSize: 16,
        fontWeight: 800,
        background: canConfirm ? "linear-gradient(135deg," + C.green + ",#047857)" : C.g200,
        color: canConfirm ? C.white : C.g400,
        boxShadow: canConfirm ? "0 3px 10px rgba(5,150,105,0.3)" : "none"
      },
      children: "✅ Enter"
    }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
      style: {
        display: "flex",
        gap: 6
      },
      children: [/*#__PURE__*/_jsxDEV("button", {
        onClick: onPrev,
        disabled: !canPrev,
        style: nb(canPrev),
        children: "▲"
      }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
        onClick: onNext,
        disabled: !canNext,
        style: nb(canNext),
        children: "▼"
      }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
        onClick: () => onPress("C"),
        style: {
          flex: 1,
          height: 60,
          borderRadius: 12,
          border: "none",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 800,
          background: "#FEF2F2",
          color: C.red,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        },
        children: "CLR"
      }, void 0, false)]
    }, void 0, true)]
  }, void 0, true);
}
function S1Head({
  num,
  label,
  done,
  active,
  onClick
}) {
  return /*#__PURE__*/_jsxDEV("div", {
    onClick: onClick,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 14px",
      cursor: "pointer",
      background: done ? C.green : active ? C.blue + "10" : C.g50,
      borderBottom: "1px solid " + C.g100,
      transition: "background 0.15s"
    },
    children: [/*#__PURE__*/_jsxDEV("div", {
      style: {
        width: 22,
        height: 22,
        borderRadius: 11,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: 11,
        background: done ? C.white : active ? C.blue + "30" : C.g200,
        color: done ? C.green : active ? C.blue : C.g500
      },
      children: done ? "✓" : num
    }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: done ? C.white : active ? C.blue : C.g600,
        flex: 1
      },
      children: label
    }, void 0, false)]
  }, void 0, true);
}
function Step2View({
  form,
  setInfo,
  handleSave,
  setStep,
  visIn,
  visOut,
  visFields,
  activeCode,
  numDisp,
  limits,
  onPress,
  onConfirm,
  onRowClick,
  moveActive,
  rowRefs,
  listRef,
  complete,
  missing,
  editIdx,
  ALL_FIELDS,
  vis,
  isAbn
}) {
  const filled = visFields.filter(f => form.values[f.code] !== "").length;
  const total = visFields.length;
  const pct = total > 0 ? Math.round(filled / total * 100) : 0;
  const ai = visFields.findIndex(f => f.code === activeCode);
  return /*#__PURE__*/_jsxDEV("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    },
    children: [/*#__PURE__*/_jsxDEV("div", {
      style: {
        flexShrink: 0,
        background: "linear-gradient(135deg," + C.navy + "," + C.blue + ")",
        padding: "8px 14px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
      },
      children: /*#__PURE__*/_jsxDEV("div", {
        style: {
          display: "flex",
          gap: 14,
          flexWrap: "wrap",
          alignItems: "center"
        },
        children: [[["点検日", form.inspectionDate], ["点検者", form.inspector], ["階", form.floor], ["部屋名", form.room], ["管理番号", form.managementNo], ["機器番号", form.unitNo]].map(([k, v]) => /*#__PURE__*/_jsxDEV("div", {
          style: {
            display: "flex",
            gap: 4,
            alignItems: "baseline"
          },
          children: [/*#__PURE__*/_jsxDEV("span", {
            style: {
              fontSize: 9,
              fontWeight: 700,
              color: "rgba(255,255,255,0.55)",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            },
            children: k
          }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
            style: {
              fontSize: 13,
              fontWeight: 700,
              color: C.white
            },
            children: v || "—"
          }, void 0, false)]
        }, k, true)), /*#__PURE__*/_jsxDEV("button", {
          onClick: () => setStep(1),
          style: {
            marginLeft: "auto",
            padding: "4px 12px",
            borderRadius: 6,
            border: "1.5px solid rgba(255,255,255,0.4)",
            background: "rgba(255,255,255,0.15)",
            color: C.white,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 700
          },
          children: "← 修正"
        }, void 0, false)]
      }, void 0, true)
    }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
      style: {
        flex: 1,
        display: "flex",
        overflow: "hidden"
      },
      children: [/*#__PURE__*/_jsxDEV("div", {
        ref: listRef,
        style: {
          flex: 1,
          overflowY: "auto",
          background: C.white
        },
        children: /*#__PURE__*/_jsxDEV("table", {
          style: {
            width: "100%",
            borderCollapse: "collapse"
          },
          children: [/*#__PURE__*/_jsxDEV("thead", {
            children: /*#__PURE__*/_jsxDEV("tr", {
              style: {
                background: C.g100,
                position: "sticky",
                top: 0,
                zIndex: 2
              },
              children: [/*#__PURE__*/_jsxDEV("th", {
                style: {
                  width: 5,
                  padding: 0,
                  borderBottom: "2px solid " + C.g200
                }
              }, void 0, false), [["コード", 62], ["項目名", null], ["単位", 48], ["測定値", 110]].map(([h, w]) => /*#__PURE__*/_jsxDEV("th", {
                style: {
                  padding: "8px 8px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.g500,
                  textAlign: h === "測定値" ? "right" : "center",
                  borderBottom: "2px solid " + C.g200,
                  width: w || undefined,
                  whiteSpace: "nowrap"
                },
                children: h
              }, h, false))]
            }, void 0, true)
          }, void 0, false), /*#__PURE__*/_jsxDEV("tbody", {
            children: [visIn.length > 0 && /*#__PURE__*/_jsxDEV(_Fragment, {
              children: [/*#__PURE__*/_jsxDEV("tr", {
                children: /*#__PURE__*/_jsxDEV("td", {
                  colSpan: 5,
                  style: {
                    padding: "6px 10px",
                    background: C.blue + "12",
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.blue,
                    borderBottom: "1px solid " + C.blue + "20"
                  },
                  children: "室内機（インドア）"
                }, void 0, false)
              }, void 0, false), visIn.map((f, i) => {
                const act = activeCode === f.code;
                const v = act ? numDisp : form.values[f.code];
                return /*#__PURE__*/_jsxDEV(FieldRow, {
                  f: f,
                  isIn: true,
                  idx: i,
                  active: act,
                  val: v,
                  abn: isAbn(f.code, v, limits),
                  dimmed: !!activeCode && !act,
                  onClick: () => onRowClick(f),
                  fRef: el => {
                    rowRefs.current[f.code] = el;
                  }
                }, f.code, false);
              })]
            }, void 0, true), visOut.length > 0 && /*#__PURE__*/_jsxDEV(_Fragment, {
              children: [/*#__PURE__*/_jsxDEV("tr", {
                children: /*#__PURE__*/_jsxDEV("td", {
                  colSpan: 5,
                  style: {
                    padding: "6px 10px",
                    background: C.teal + "12",
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.teal,
                    borderBottom: "1px solid " + C.teal + "20"
                  },
                  children: "室外機（アウトドア）"
                }, void 0, false)
              }, void 0, false), visOut.map((f, i) => {
                const act = activeCode === f.code;
                const v = act ? numDisp : form.values[f.code];
                return /*#__PURE__*/_jsxDEV(FieldRow, {
                  f: f,
                  isIn: false,
                  idx: i,
                  active: act,
                  val: v,
                  abn: isAbn(f.code, v, limits),
                  dimmed: !!activeCode && !act,
                  onClick: () => onRowClick(f),
                  fRef: el => {
                    rowRefs.current[f.code] = el;
                  }
                }, f.code, false);
              })]
            }, void 0, true)]
          }, void 0, true)]
        }, void 0, true)
      }, void 0, false), /*#__PURE__*/_jsxDEV(Numpad, {
        display: numDisp,
        onPress: onPress,
        onConfirm: onConfirm,
        canConfirm: !!activeCode && numDisp !== "",
        onPrev: () => moveActive(-1),
        onNext: () => moveActive(1),
        canPrev: ai > 0,
        canNext: ai >= 0 && ai < visFields.length - 1
      }, void 0, false)]
    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
      style: {
        flexShrink: 0,
        background: C.white,
        borderTop: "2px solid " + C.g200,
        padding: "10px 12px",
        display: "flex",
        gap: 10,
        alignItems: "stretch"
      },
      children: [/*#__PURE__*/_jsxDEV("div", {
        style: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 4
        },
        children: [/*#__PURE__*/_jsxDEV("div", {
          style: {
            fontSize: 12,
            fontWeight: 700,
            color: C.g500
          },
          children: "📝 備考・特記事項"
        }, void 0, false), /*#__PURE__*/_jsxDEV("textarea", {
          value: form.remarks,
          onChange: e => setInfo("remarks", e.target.value),
          placeholder: "異常箇所、特記事項など...",
          style: {
            flex: 1,
            width: "100%",
            padding: "10px 12px",
            borderRadius: 9,
            fontSize: 14,
            border: "1.5px solid " + C.g200,
            background: C.inp,
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
            resize: "none",
            minHeight: 200,
            lineHeight: 1.5
          }
        }, void 0, false)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: 5,
          width: 136,
          flexShrink: 0
        },
        children: [/*#__PURE__*/_jsxDEV("div", {
          style: {
            background: C.g200,
            borderRadius: 6,
            height: 6,
            overflow: "hidden"
          },
          children: /*#__PURE__*/_jsxDEV("div", {
            style: {
              width: pct + "%",
              height: "100%",
              background: complete ? C.green : C.blue,
              borderRadius: 6,
              transition: "width 0.3s"
            }
          }, void 0, false)
        }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
          style: {
            fontSize: 10,
            color: C.g400,
            textAlign: "center"
          },
          children: [filled, "/", total, "\u3000", pct, "%"]
        }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
          onClick: () => handleSave("next"),
          disabled: !complete,
          style: {
            flex: 1,
            borderRadius: 12,
            border: "none",
            cursor: complete ? "pointer" : "not-allowed",
            fontWeight: 800,
            fontSize: complete ? 20 : 13,
            background: complete ? "linear-gradient(135deg," + C.green + ",#047857)" : C.g200,
            color: complete ? C.white : C.g400,
            boxShadow: complete ? "0 4px 14px rgba(5,150,105,0.35)" : "none",
            lineHeight: 1.4,
            textAlign: "center"
          },
          children: complete ? "💾 保存" : "⏳ あと" + missing + "項目"
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true)]
  }, void 0, true);
}

// ─── セッション開始画面 ────────────────────────────────────────────────────
function SessionView({
  devList,
  inspList,
  sessionInfo,
  setSessionInfo,
  onStart,
  records,
  undoneOnly,
  setUndoneOnly
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(sessionInfo?.date || today);
  const [inspector, setInspector] = useState(sessionInfo?.inspector || "");
  const [access, setAccess] = useState(sessionInfo?.roomAccess || {});
  const [memoOpen, setMemoOpen] = useState({});
  const [floorSortAsc, setFloorSortAsc] = useState(false); // デフォルト降順（10F→1F）
  // 対象階（前回引き継ぎ、なければ全階選択）
  const allFloors = [...new Set(devList.map(d => d.floor).filter(Boolean))].sort();
  const [targetFloors, setTargetFloors] = useState(() => sessionInfo?.targetFloors || []);
  const sortedFloors = floorSortAsc ? [...allFloors] : [...allFloors].reverse();
  const rooms = [...new Map(devList.map(d => [d.floor + "__" + d.room, {
    floor: d.floor,
    room: d.room
  }])).values()].sort((a, b) => a.floor.localeCompare(b.floor) || a.room.localeCompare(b.room));
  const key = (floor, room) => floor + "__" + room;
  const setAcc = (k, val) => setAccess(p => ({
    ...p,
    [k]: {
      ...p[k],
      ...val
    }
  }));
  const getAcc = k => access[k]?.status || "OK";
  const getMemo = k => access[k]?.memo || "";
  const toggleFloor = fl => setTargetFloors(p => p.includes(fl) ? p.filter(f => f !== fl) : [...p, fl]);
  // 対象階の部屋のみでNG件数カウント
  const targetRooms = rooms.filter(r => targetFloors.includes(r.floor));
  const ngCount = targetRooms.filter(r => getAcc(key(r.floor, r.room)) === "NG").length;
  const undoneCount = devList.filter(d => {
    if (targetFloors && targetFloors.length > 0 && !targetFloors.includes(d.floor)) return false;
    return !records.some(r => r.managementNo === d.managementNo && r.unitNo === d.unitNo && Object.values(r.values).some(v => v !== ""));
  }).length;
  const canStart = !!date && !!inspector && (allFloors.length === 0 || targetFloors.length > 0);
  return /*#__PURE__*/_jsxDEV("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "16px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 16,
      maxWidth: 680,
      margin: "0 auto",
      width: "100%"
    },
    children: [/*#__PURE__*/_jsxDEV("div", {
      style: {
        background: "linear-gradient(135deg," + C.navy + "," + C.blue + ")",
        borderRadius: 16,
        padding: "18px 22px",
        color: C.white,
        boxShadow: "0 4px 20px rgba(27,58,107,0.3)"
      },
      children: [/*#__PURE__*/_jsxDEV("div", {
        style: {
          fontSize: 20,
          fontWeight: 800,
          marginBottom: 4
        },
        children: "🗓️ 点検セッション開始"
      }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
        style: {
          fontSize: 13,
          color: "rgba(255,255,255,0.75)"
        },
        children: "点検日・点検者・対象階・入室可否を設定してから点検を開始してください"
      }, void 0, false)]
    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
      style: {
        background: C.white,
        borderRadius: 14,
        padding: "16px 20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.07)"
      },
      children: [/*#__PURE__*/_jsxDEV("div", {
        style: {
          fontSize: 13,
          fontWeight: 800,
          color: C.navy,
          marginBottom: 10
        },
        children: "📅 点検日"
      }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
        type: "date",
        value: date,
        onChange: e => setDate(e.target.value),
        style: {
          width: "100%",
          fontSize: 18,
          fontWeight: 700,
          padding: "10px 14px",
          border: "2px solid " + (date ? C.blue : C.g200),
          borderRadius: 10,
          outline: "none",
          color: C.g800,
          background: C.g50
        }
      }, void 0, false)]
    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
      style: {
        background: C.white,
        borderRadius: 14,
        padding: "16px 20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.07)"
      },
      children: [/*#__PURE__*/_jsxDEV("div", {
        style: {
          fontSize: 13,
          fontWeight: 800,
          color: C.navy,
          marginBottom: 10
        },
        children: "👤 点検者"
      }, void 0, false), inspList.length > 0 ? /*#__PURE__*/_jsxDEV("select", {
        value: inspector,
        onChange: e => setInspector(e.target.value),
        style: {
          width: "100%",
          fontSize: 17,
          fontWeight: 700,
          padding: "10px 14px",
          border: "2px solid " + (inspector ? C.blue : C.g200),
          borderRadius: 10,
          outline: "none",
          color: inspector ? C.g800 : C.g400,
          background: C.g50,
          appearance: "auto",
          cursor: "pointer"
        },
        children: [/*#__PURE__*/_jsxDEV("option", {
          value: "",
          children: "— 点検者を選択 —"
        }, void 0, false), inspList.map(name => /*#__PURE__*/_jsxDEV("option", {
          value: name,
          children: name
        }, name, false))]
      }, void 0, true) : /*#__PURE__*/_jsxDEV("input", {
        type: "text",
        value: inspector,
        onChange: e => setInspector(e.target.value),
        placeholder: "点検者名を入力",
        style: {
          width: "100%",
          fontSize: 16,
          padding: "10px 14px",
          border: "2px solid " + (inspector ? C.blue : C.g200),
          borderRadius: 10,
          outline: "none",
          background: C.g50
        }
      }, void 0, false)]
    }, void 0, true), allFloors.length === 0 ? /*#__PURE__*/_jsxDEV("div", {
      style: {
        background: "#FFF7ED",
        borderRadius: 14,
        padding: "16px 20px",
        border: "1.5px solid #F59E0B",
        boxShadow: "0 2px 10px rgba(0,0,0,0.07)"
      },
      children: [/*#__PURE__*/_jsxDEV("div", {
        style: {
          fontSize: 13,
          fontWeight: 800,
          color: "#92400E",
          marginBottom: 6
        },
        children: "🏢 本日の対象階"
      }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
        style: {
          fontSize: 12,
          color: "#92400E"
        },
        children: ["⚠️ 機器リストCSVが読み込まれていません。", /*#__PURE__*/_jsxDEV("br", {}, void 0, false), "設定画面から機器リストCSVを読み込むと、階の選択・入室可否チェックが利用できます。"]
      }, void 0, true)]
    }, void 0, true) : /*#__PURE__*/_jsxDEV("div", {
      style: {
        background: C.white,
        borderRadius: 14,
        padding: "16px 20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.07)"
      },
      children: [/*#__PURE__*/_jsxDEV("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12
        },
        children: /*#__PURE__*/_jsxDEV("div", {
          style: {
            fontSize: 13,
            fontWeight: 800,
            color: C.navy,
            flex: 1
          },
          children: "🏢 本日の対象階"
        }, void 0, false)
      }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
        style: {
          display: "flex",
          flexWrap: "wrap",
          gap: 8
        },
        children: [(() => {
          const allSel = allFloors.length > 0 && allFloors.every(f => targetFloors.includes(f));
          return /*#__PURE__*/_jsxDEV("button", {
            onClick: () => setTargetFloors(allSel ? [] : allFloors),
            style: {
              padding: "10px 20px",
              borderRadius: 10,
              border: "2px solid " + (allSel ? C.teal : C.g200),
              background: allSel ? "linear-gradient(135deg," + C.teal + ",#0D9488)" : C.white,
              color: allSel ? C.white : C.g600,
              fontWeight: 800,
              fontSize: 15,
              cursor: "pointer",
              transition: "all 0.15s",
              minWidth: 80,
              textAlign: "center"
            },
            children: ["すべて", allSel ? " ✓" : ""]
          }, void 0, true);
        })(), sortedFloors.map(fl => {
          const sel = targetFloors.includes(fl);
          return /*#__PURE__*/_jsxDEV("button", {
            onClick: () => toggleFloor(fl),
            style: {
              padding: "10px 20px",
              borderRadius: 10,
              border: "2px solid " + (sel ? C.blue : C.g200),
              background: sel ? "linear-gradient(135deg," + C.navy + "," + C.blue + ")" : C.white,
              color: sel ? C.white : C.g600,
              fontWeight: 800,
              fontSize: 15,
              cursor: "pointer",
              transition: "all 0.15s",
              minWidth: 64,
              textAlign: "center"
            },
            children: [fl, sel ? " ✓" : ""]
          }, fl, true);
        })]
      }, void 0, true), targetFloors.length === 0 && /*#__PURE__*/_jsxDEV("div", {
        style: {
          marginTop: 8,
          fontSize: 12,
          color: C.red,
          fontWeight: 700
        },
        children: "⚠️ 対象階を1つ以上選択してください"
      }, void 0, false), targetFloors.length > 0 && devList.length > 0 && /*#__PURE__*/_jsxDEV("div", {
        style: {
          marginTop: 10,
          display: "flex",
          gap: 8,
          alignItems: "center"
        },
        children: [/*#__PURE__*/_jsxDEV("button", {
          onClick: () => setUndoneOnly(false),
          style: {
            flex: 1,
            padding: "10px",
            borderRadius: 10,
            border: "2px solid " + (undoneOnly ? C.g200 : C.blue),
            background: undoneOnly ? C.white : "linear-gradient(135deg," + C.navy + "," + C.blue + ")",
            color: undoneOnly ? C.g500 : C.white,
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.15s"
          },
          children: "📋 全機器"
        }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
          onClick: () => setUndoneOnly(true),
          style: {
            flex: 1,
            padding: "10px",
            borderRadius: 10,
            border: "2px solid " + (undoneOnly ? C.red : C.g200),
            background: undoneOnly ? "#FEF2F2" : C.white,
            color: undoneOnly ? C.red : C.g500,
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.15s"
          },
          children: ["⏳ 未入力分 ", undoneCount > 0 ? "(" + undoneCount + ")" : "(なし)"]
        }, void 0, true)]
      }, void 0, true), allFloors.length > 1 && /*#__PURE__*/_jsxDEV("div", {
        style: {
          marginTop: 10,
          display: "flex",
          justifyContent: "flex-end"
        },
        children: /*#__PURE__*/_jsxDEV("button", {
          onClick: () => setFloorSortAsc(p => !p),
          style: {
            padding: "3px 10px",
            borderRadius: 6,
            border: "1.5px solid " + C.teal,
            background: C.teal + "18",
            color: C.teal,
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer"
          },
          children: ["表示順 ", floorSortAsc ? "▲ 昇順" : "▼ 降順"]
        }, void 0, true)
      }, void 0, false)]
    }, void 0, true), targetRooms.length > 0 && /*#__PURE__*/_jsxDEV("div", {
      style: {
        background: C.white,
        borderRadius: 14,
        padding: "16px 20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.07)"
      },
      children: [/*#__PURE__*/_jsxDEV("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12
        },
        children: /*#__PURE__*/_jsxDEV("div", {
          style: {
            fontSize: 13,
            fontWeight: 800,
            color: C.navy,
            flex: 1
          },
          children: "🚪 入室可否チェック"
        }, void 0, false)
      }, void 0, false), ngCount > 0 && /*#__PURE__*/_jsxDEV("div", {
        style: {
          marginBottom: 10,
          padding: "6px 12px",
          background: "#FEF2F2",
          border: "1.5px solid " + C.red,
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 700,
          color: C.red
        },
        children: ["⚠️ NG ", ngCount, "部屋 — 点検フォームでグレーアウトされます"]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: 12
        },
        children: sortedFloors.filter(fl => targetFloors.includes(fl)).map(fl => {
          const flRooms = rooms.filter(r => r.floor === fl);
          const flNg = flRooms.filter(r => getAcc(key(r.floor, r.room)) === "NG").length;
          return /*#__PURE__*/_jsxDEV("div", {
            children: [/*#__PURE__*/_jsxDEV("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6
              },
              children: [/*#__PURE__*/_jsxDEV("div", {
                style: {
                  fontSize: 12,
                  fontWeight: 800,
                  color: C.g600,
                  flex: 1,
                  letterSpacing: "0.05em"
                },
                children: fl
              }, void 0, false), flNg > 0 && /*#__PURE__*/_jsxDEV("span", {
                style: {
                  fontSize: 10,
                  fontWeight: 700,
                  color: C.red
                },
                children: ["NG ", flNg]
              }, void 0, true)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: 4
              },
              children: flRooms.map(r => {
                const k = key(r.floor, r.room);
                const acc = getAcc(k);
                const isNG = acc === "NG";
                const memo = getMemo(k);
                const open = memoOpen[k];
                return /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    borderRadius: 10,
                    border: "1.5px solid " + (isNG ? C.red : C.g200),
                    overflow: "hidden",
                    transition: "border-color 0.15s"
                  },
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 14px",
                      background: isNG ? "#FEF2F2" : C.g50
                    },
                    children: [/*#__PURE__*/_jsxDEV("span", {
                      style: {
                        flex: 1,
                        fontSize: 14,
                        fontWeight: 700,
                        color: isNG ? C.red : C.g800
                      },
                      children: r.room
                    }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                      style: {
                        display: "flex",
                        gap: 4
                      },
                      children: ["OK", "NG"].map(s => /*#__PURE__*/_jsxDEV("button", {
                        onClick: () => setAcc(k, {
                          status: s
                        }),
                        style: {
                          padding: "6px 16px",
                          borderRadius: 7,
                          border: "2px solid " + (acc === s ? s === "OK" ? C.green : C.red : C.g200),
                          background: acc === s ? s === "OK" ? C.green : C.red : C.white,
                          color: acc === s ? C.white : C.g500,
                          fontWeight: 800,
                          fontSize: 13,
                          cursor: "pointer",
                          transition: "all 0.12s"
                        },
                        children: s
                      }, s, false))
                    }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                      onClick: () => setMemoOpen(p => ({
                        ...p,
                        [k]: !p[k]
                      })),
                      style: {
                        padding: "5px 10px",
                        borderRadius: 7,
                        border: "1.5px solid " + C.g200,
                        background: memo ? C.blue + "18" : C.white,
                        color: memo ? C.blue : C.g400,
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer"
                      },
                      children: [memo ? "📝" : "📝+", " 備考"]
                    }, void 0, true)]
                  }, void 0, true), open && /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      padding: "8px 14px",
                      borderTop: "1px solid " + C.g200,
                      background: C.white
                    },
                    children: /*#__PURE__*/_jsxDEV("input", {
                      type: "text",
                      value: memo,
                      onChange: e => setAcc(k, {
                        memo: e.target.value
                      }),
                      placeholder: "備考（入室不可理由など）",
                      style: {
                        width: "100%",
                        fontSize: 13,
                        padding: "8px 12px",
                        border: "1.5px solid " + C.g200,
                        borderRadius: 8,
                        outline: "none",
                        background: C.g50
                      }
                    }, void 0, false)
                  }, void 0, false)]
                }, k, true);
              })
            }, void 0, false)]
          }, fl, true);
        })
      }, void 0, false)]
    }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
      disabled: !canStart,
      onClick: () => {
        const info = {
          date,
          inspector,
          targetFloors,
          roomAccess: access
        };
        try {
          localStorage.setItem("acSessionInfo", JSON.stringify(info));
        } catch (e) {}
        onStart(info);
      },
      style: {
        padding: "18px",
        borderRadius: 14,
        border: "none",
        cursor: canStart ? "pointer" : "not-allowed",
        background: canStart ? "linear-gradient(135deg," + C.navy + "," + C.blue + ")" : "#CBD5E1",
        color: C.white,
        fontWeight: 800,
        fontSize: 18,
        boxShadow: canStart ? "0 4px 20px rgba(37,99,176,0.4)" : "none",
        opacity: canStart ? 1 : 0.7,
        transition: "all 0.2s",
        flexShrink: 0
      },
      children: !date || !inspector ? "点検日・点検者を入力してください" : allFloors.length > 0 && targetFloors.length === 0 ? "対象階を選択してください" : allFloors.length > 0 ? "✅ 点検を開始する（" + targetFloors.slice().sort().join("・") + ")" : "✅ 点検を開始する"
    }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
      style: {
        height: 8
      }
    }, void 0, false)]
  }, void 0, true);
}
function Step1View({
  form,
  setInfo,
  inspList,
  devList,
  devSearch,
  setDevSearch,
  s1DateDone,
  s1InspDone,
  s1DevDone,
  step1Valid,
  records,
  s1Focus,
  setS1Focus,
  goToStep2,
  handleStep1TmpSave,
  setForm,
  editIdx,
  lastInsp,
  lastDate,
  setStep,
  setView,
  sessionInfo,
  undoneOnly,
  setUndoneOnly
}) {
  const allFloors = [...new Set(devList.map(d => d.floor).filter(Boolean))].sort();
  const roomAccess = sessionInfo?.roomAccess || {};
  const targetFloors = sessionInfo?.targetFloors || null; // nullなら全階対象
  // 非対象階 or 入室NGならグレーアウト
  const isNG = (floor, room) => {
    if (targetFloors && targetFloors.length > 0 && !targetFloors.includes(floor)) return true;
    return (roomAccess[floor + "__" + room]?.status || "OK") === "NG";
  };
  const isNGReason = (floor, room) => {
    if (targetFloors && targetFloors.length > 0 && !targetFloors.includes(floor)) return "対象外";
    return (roomAccess[floor + "__" + room]?.status || "OK") === "NG" ? "入室NG" : null;
  };
  return /*#__PURE__*/_jsxDEV("div", {
    style: {
      flex: 1,
      overflow: "hidden",
      display: "flex",
      flexDirection: "row",
      gap: 0
    },
    children: [/*#__PURE__*/_jsxDEV("div", {
      style: {
        flex: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        padding: "10px 12px 12px",
        gap: 0
      },
      children: [/*#__PURE__*/_jsxDEV("div", {
        style: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "1px",
          background: C.g200,
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 1px 8px rgba(0,0,0,0.08)"
        },
        children: [/*#__PURE__*/_jsxDEV("div", {
          style: {
            display: "flex",
            background: C.g200,
            gap: "1px"
          },
          children: [/*#__PURE__*/_jsxDEV("div", {
            style: {
              width: 110,
              flexShrink: 0,
              background: C.green + "18",
              display: "flex",
              alignItems: "center",
              padding: "8px 12px"
            },
            children: /*#__PURE__*/_jsxDEV("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 7
              },
              children: [/*#__PURE__*/_jsxDEV("div", {
                style: {
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  background: C.green,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  fontWeight: 700,
                  color: C.white
                },
                children: "✓"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                style: {
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.green
                },
                children: "点検日"
              }, void 0, false)]
            }, void 0, true)
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            style: {
              flex: 1,
              background: C.white,
              padding: "7px 10px",
              display: "flex",
              alignItems: "center",
              gap: 8
            },
            children: [/*#__PURE__*/_jsxDEV("span", {
              style: {
                flex: 1,
                fontSize: 15,
                fontWeight: 700,
                color: C.navy,
                fontFamily: "monospace"
              },
              children: form.inspectionDate || "—"
            }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
              onMouseDown: e => e.preventDefault(),
              onClick: () => setView("session"),
              style: {
                padding: "4px 10px",
                borderRadius: 7,
                border: "1.5px solid " + C.g300,
                background: C.g50,
                color: C.g600,
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 700,
                whiteSpace: "nowrap"
              },
              children: "修正"
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          style: {
            display: "flex",
            background: C.g200,
            gap: "1px"
          },
          children: [/*#__PURE__*/_jsxDEV("div", {
            style: {
              width: 110,
              flexShrink: 0,
              background: C.green + "18",
              display: "flex",
              alignItems: "center",
              padding: "8px 12px"
            },
            children: /*#__PURE__*/_jsxDEV("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 7
              },
              children: [/*#__PURE__*/_jsxDEV("div", {
                style: {
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  background: C.green,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  fontWeight: 700,
                  color: C.white
                },
                children: "✓"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                style: {
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.green
                },
                children: "点検者"
              }, void 0, false)]
            }, void 0, true)
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            style: {
              flex: 1,
              background: C.white,
              padding: "7px 10px",
              display: "flex",
              alignItems: "center",
              gap: 8
            },
            children: [/*#__PURE__*/_jsxDEV("span", {
              style: {
                flex: 1,
                fontSize: 15,
                fontWeight: 700,
                color: C.navy
              },
              children: form.inspector || "—"
            }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
              onMouseDown: e => e.preventDefault(),
              onClick: () => setView("session"),
              style: {
                padding: "4px 10px",
                borderRadius: 7,
                border: "1.5px solid " + C.g300,
                background: C.g50,
                color: C.g600,
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 700,
                whiteSpace: "nowrap"
              },
              children: "修正"
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          style: {
            display: "flex",
            background: C.g200,
            gap: "1px",
            opacity: s1InspDone ? 1 : 0.45
          },
          children: [/*#__PURE__*/_jsxDEV("div", {
            style: {
              width: 110,
              flexShrink: 0,
              background: s1DevDone ? C.green + "18" : C.g50,
              padding: "10px 12px"
            },
            children: /*#__PURE__*/_jsxDEV("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 7
              },
              children: [/*#__PURE__*/_jsxDEV("div", {
                style: {
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  background: s1DevDone ? C.green : C.g300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  fontWeight: 700,
                  color: C.white
                },
                children: s1DevDone ? "✓" : "3"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                style: {
                  fontSize: 12,
                  fontWeight: 700,
                  color: s1DevDone ? C.green : C.g600
                },
                children: "機器選択"
              }, void 0, false)]
            }, void 0, true)
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            style: {
              background: C.white,
              padding: "8px 10px",
              display: "flex",
              flexDirection: "column",
              gap: 5,
              pointerEvents: s1InspDone ? "auto" : "none"
            },
            children: [targetFloors && targetFloors.length > 0 && /*#__PURE__*/_jsxDEV("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexWrap: "wrap"
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                style: {
                  fontSize: 10,
                  fontWeight: 700,
                  color: C.g500
                },
                children: "本日の対象："
              }, void 0, false), (() => {
                // セッション画面と同じ降順で表示
                const ordered = [...allFloors].reverse().filter(f => targetFloors.includes(f));
                return ordered.map(fl => /*#__PURE__*/_jsxDEV("span", {
                  style: {
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.blue,
                    background: C.blue + "15",
                    padding: "1px 7px",
                    borderRadius: 4
                  },
                  children: fl
                }, fl, false));
              })(), /*#__PURE__*/_jsxDEV("button", {
                onMouseDown: e => e.preventDefault(),
                onClick: () => setView("session"),
                style: {
                  marginLeft: "auto",
                  padding: "2px 8px",
                  borderRadius: 6,
                  border: "1.5px solid " + C.g300,
                  background: C.g50,
                  color: C.g600,
                  cursor: "pointer",
                  fontSize: 10,
                  fontWeight: 700
                },
                children: "修正"
              }, void 0, false)]
            }, void 0, true), devList.length > 0 ? /*#__PURE__*/_jsxDEV(_Fragment, {
              children: [/*#__PURE__*/_jsxDEV("div", {
                style: {
                  display: "flex",
                  gap: 8,
                  alignItems: "center"
                },
                children: [/*#__PURE__*/_jsxDEV("div", {
                  style: {
                    position: "relative",
                    flex: 1
                  },
                  children: [/*#__PURE__*/_jsxDEV("input", {
                    value: devSearch,
                    onChange: e => {
                      setDevSearch(e.target.value);
                    },
                    onFocus: () => setS1Focus("devSearch"),
                    placeholder: "管理番号・部屋名で検索…",
                    style: {
                      width: "100%",
                      padding: "7px 10px 7px 28px",
                      borderRadius: 7,
                      fontSize: 13,
                      border: "1.5px solid " + (s1Focus === "devSearch" ? C.blue : C.g200),
                      background: C.inp,
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "inherit"
                    }
                  }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                    style: {
                      position: "absolute",
                      left: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: 12,
                      color: C.blue,
                      pointerEvents: "none"
                    },
                    children: "🔍"
                  }, void 0, false), devSearch && /*#__PURE__*/_jsxDEV("button", {
                    onMouseDown: e => e.preventDefault(),
                    onClick: () => setDevSearch(""),
                    style: {
                      position: "absolute",
                      right: 6,
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      fontSize: 14,
                      color: C.g400,
                      lineHeight: 1
                    },
                    children: "✕"
                  }, void 0, false)]
                }, void 0, true), s1DevDone && /*#__PURE__*/_jsxDEV("button", {
                  onMouseDown: e => e.preventDefault(),
                  onClick: () => {
                    setForm(p => ({
                      ...p,
                      floor: "",
                      room: "",
                      managementNo: "",
                      unitNo: ""
                    }));
                    setDevSearch("");
                  },
                  style: {
                    padding: "5px 10px",
                    borderRadius: 7,
                    border: "1.5px solid " + C.g200,
                    background: C.white,
                    color: C.g500,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    whiteSpace: "nowrap"
                  },
                  children: "変更"
                }, void 0, false)]
              }, void 0, true), s1DevDone && !devSearch ? /*#__PURE__*/_jsxDEV("div", {
                style: {
                  padding: "7px 10px",
                  borderRadius: 8,
                  background: "linear-gradient(135deg," + C.navy + "," + C.blue + ")",
                  color: C.white,
                  display: "flex",
                  gap: 12,
                  alignItems: "center"
                },
                children: [/*#__PURE__*/_jsxDEV("span", {
                  style: {
                    fontWeight: 700,
                    fontSize: 13,
                    flex: 1
                  },
                  children: [form.floor, "\u3000", form.room]
                }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                  style: {
                    fontFamily: "monospace",
                    fontSize: 12,
                    opacity: 0.85
                  },
                  children: [form.managementNo, " / ", form.unitNo]
                }, void 0, true)]
              }, void 0, true) : /*#__PURE__*/_jsxDEV("div", {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  overflowY: "auto",
                  maxHeight: 196,
                  minHeight: 80
                },
                children: (() => {
                  // 対象階の表示順（sortedFloors=降順 or 昇順）を尊重
                  const floorOrder = targetFloors && targetFloors.length > 0 ? targetFloors // セッション画面の選択順（sortedFloorsと同じ降順）
                  : null;
                  const sorted = [...devList].sort((a, b) => {
                    if (!floorOrder) return a.floor.localeCompare(b.floor) || a.room.localeCompare(b.room);
                    const ai = floorOrder.indexOf(a.floor);
                    const bi = floorOrder.indexOf(b.floor);
                    // 対象階内は降順（sortedFloorsと同じ並び）
                    const ar = ai < 0 ? 999 : ai;
                    const br = bi < 0 ? 999 : bi;
                    if (ar !== br) return ar - br;
                    // 同じ階内は部屋名順
                    return a.room.localeCompare(b.room);
                  });
                  const filtered = sorted.filter(d => {
                    const n = s => s.replace(/-/g, "").toLowerCase();
                    if (devSearch && !(n(d.managementNo).includes(n(devSearch)) || n(d.unitNo).includes(n(devSearch)) || d.room.includes(devSearch) || d.floor.includes(devSearch))) return false;
                    if (undoneOnly) {
                      const hasMeas = records.some(r => r.managementNo === d.managementNo && r.unitNo === d.unitNo && Object.values(r.values).some(v => v !== ""));
                      if (hasMeas) return false;
                    }
                    return true;
                  });
                  if (filtered.length === 0) return /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      fontSize: 12,
                      color: C.g400,
                      padding: "6px 4px"
                    },
                    children: "該当する機器がありません"
                  }, void 0, false);
                  return filtered.map((dev, i) => {
                    const sel = form.managementNo === dev.managementNo && form.unitNo === dev.unitNo;
                    const hasMeas = records.some(r => r.managementNo === dev.managementNo && r.unitNo === dev.unitNo && Object.values(r.values).some(v => v !== ""));
                    const ngRoom = isNG(dev.floor, dev.room);
                    const ngReason = isNGReason(dev.floor, dev.room);
                    if (ngRoom) return /*#__PURE__*/_jsxDEV("div", {
                      style: {
                        padding: "7px 10px",
                        borderRadius: 7,
                        border: "1.5px solid " + C.g200,
                        background: C.g100,
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        flexShrink: 0,
                        opacity: 0.45,
                        userSelect: "none"
                      },
                      children: [/*#__PURE__*/_jsxDEV("span", {
                        style: {
                          fontSize: 13,
                          fontWeight: 700,
                          flex: 1,
                          color: C.g400,
                          textDecoration: "line-through"
                        },
                        children: [dev.floor, "\u3000", dev.room]
                      }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                        style: {
                          fontSize: 12,
                          fontFamily: "monospace",
                          opacity: 0.6,
                          color: C.g400
                        },
                        children: [dev.managementNo, " / ", dev.unitNo]
                      }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                        style: {
                          fontSize: 10,
                          fontWeight: 700,
                          color: ngReason === "対象外" ? C.g400 : C.red,
                          background: ngReason === "対象外" ? C.g200 : "#FEF2F2",
                          padding: "1px 6px",
                          borderRadius: 4,
                          whiteSpace: "nowrap"
                        },
                        children: ngReason
                      }, void 0, false)]
                    }, i, true);
                    if (hasMeas && !sel) return /*#__PURE__*/_jsxDEV("button", {
                      onMouseDown: e => e.preventDefault(),
                      onClick: () => {
                        setForm(p => ({
                          ...p,
                          floor: dev.floor,
                          room: dev.room,
                          managementNo: dev.managementNo,
                          unitNo: dev.unitNo
                        }));
                        setDevSearch("");
                        setS1Focus(null);
                      },
                      style: {
                        padding: "7px 10px",
                        borderRadius: 7,
                        border: "2px solid " + C.green,
                        cursor: "pointer",
                        textAlign: "left",
                        background: C.green + "10",
                        color: C.g800,
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        flexShrink: 0,
                        transition: "all 0.1s"
                      },
                      children: [/*#__PURE__*/_jsxDEV("span", {
                        style: {
                          fontSize: 13,
                          fontWeight: 700,
                          flex: 1
                        },
                        children: [dev.floor, "\u3000", dev.room]
                      }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                        style: {
                          fontSize: 12,
                          fontFamily: "monospace",
                          opacity: 0.8
                        },
                        children: [dev.managementNo, " / ", dev.unitNo]
                      }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                        style: {
                          fontSize: 10,
                          fontWeight: 700,
                          color: C.green,
                          background: C.green + "20",
                          padding: "1px 6px",
                          borderRadius: 4,
                          whiteSpace: "nowrap"
                        },
                        children: "入力済"
                      }, void 0, false)]
                    }, i, true);
                    return /*#__PURE__*/_jsxDEV("button", {
                      onMouseDown: e => e.preventDefault(),
                      onClick: () => {
                        setForm(p => ({
                          ...p,
                          floor: dev.floor,
                          room: dev.room,
                          managementNo: dev.managementNo,
                          unitNo: dev.unitNo
                        }));
                        setDevSearch("");
                        setS1Focus(null);
                      },
                      style: {
                        padding: "7px 10px",
                        borderRadius: 7,
                        border: "2px solid " + (sel ? C.blue : C.g200),
                        cursor: "pointer",
                        textAlign: "left",
                        background: sel ? "linear-gradient(135deg," + C.navy + "," + C.blue + ")" : C.white,
                        color: sel ? C.white : C.g800,
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        flexShrink: 0,
                        transition: "all 0.1s"
                      },
                      children: [/*#__PURE__*/_jsxDEV("span", {
                        style: {
                          fontSize: 13,
                          fontWeight: 700,
                          flex: 1
                        },
                        children: [dev.floor, "\u3000", dev.room]
                      }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                        style: {
                          fontSize: 12,
                          fontFamily: "monospace",
                          opacity: 0.8
                        },
                        children: [dev.managementNo, " / ", dev.unitNo]
                      }, void 0, true)]
                    }, i, true);
                  });
                })()
              }, void 0, false)]
            }, void 0, true) : /*#__PURE__*/_jsxDEV("div", {
              style: {
                display: "grid",
                gridTemplateColumns: "1fr 1fr 0.5fr 1.4fr",
                gap: 5
              },
              children: [{
                k: "managementNo",
                l: "管理番号",
                p: "A-001"
              }, {
                k: "unitNo",
                l: "機器番号",
                p: "IDU-001"
              }, {
                k: "floor",
                l: "階",
                p: "1F"
              }, {
                k: "room",
                l: "部屋名",
                p: "事務室"
              }].map(f => /*#__PURE__*/_jsxDEV("div", {
                children: [/*#__PURE__*/_jsxDEV("div", {
                  style: {
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.g500,
                    marginBottom: 3
                  },
                  children: f.l
                }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
                  value: form[f.k],
                  placeholder: f.p,
                  onChange: e => setInfo(f.k, e.target.value),
                  style: {
                    width: "100%",
                    padding: "7px 9px",
                    borderRadius: 7,
                    fontSize: 13,
                    border: "1.5px solid " + (form[f.k] ? C.green : C.g200),
                    background: C.inp,
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit"
                  }
                }, void 0, false)]
              }, f.k, true))
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          style: {
            display: "flex",
            background: C.g200,
            gap: "1px",
            opacity: s1DevDone ? 1 : 0.45
          },
          children: [/*#__PURE__*/_jsxDEV("div", {
            style: {
              width: 110,
              flexShrink: 0,
              background: C.teal + "10",
              padding: "10px 12px"
            },
            children: [/*#__PURE__*/_jsxDEV("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 7
              },
              children: [/*#__PURE__*/_jsxDEV("div", {
                style: {
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  background: C.teal + "50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  fontWeight: 700,
                  color: C.teal
                },
                children: "4"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                style: {
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.teal
                },
                children: "点検前状態"
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              style: {
                fontSize: 10,
                color: C.g400,
                marginTop: 2,
                paddingLeft: 25
              },
              children: "任意"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            style: {
              flex: 1,
              background: C.teal + "05",
              padding: "12px 12px",
              pointerEvents: s1DevDone ? "auto" : "none",
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
              borderTop: "1px solid " + C.teal + "20",
              flexWrap: "wrap"
            },
            children: [[{
              label: "運転",
              items: [["ON", "🟢 ON", C.blue], ["OFF", "⭕ OFF", C.blue]],
              key: "preOperation"
            }, {
              label: "運転モード",
              items: [["冷房", "❄️ 冷房", C.teal], ["暖房", "🔥 暖房", C.teal], ["送風", "💨 送風", C.teal], ["除湿", "💧 除湿", C.teal]],
              key: "preMode"
            }, {
              label: "風量",
              items: [["自動", "🔄 自動", "#7C3AED"], ["弱", "💨 弱", "#7C3AED"], ["強", "💨 強", "#7C3AED"], ["急風", "🌪️ 急風", "#7C3AED"]],
              key: "preWind"
            }].map(({
              label,
              items,
              key
            }) => /*#__PURE__*/_jsxDEV("div", {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: 4
              },
              children: [/*#__PURE__*/_jsxDEV("div", {
                style: {
                  fontSize: 10,
                  fontWeight: 700,
                  color: C.g500,
                  marginBottom: 2
                },
                children: label
              }, void 0, false), items.map(([v, txt, col]) => {
                const sel = form[key] === v;
                return /*#__PURE__*/_jsxDEV("button", {
                  onClick: () => setInfo(key, sel ? "" : v),
                  style: {
                    padding: "10px 16px",
                    borderRadius: 10,
                    border: "2px solid " + (sel ? col : C.g200),
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: 15,
                    background: sel ? "linear-gradient(135deg," + col + "," + col + "BB)" : C.white,
                    color: sel ? C.white : C.g600,
                    transition: "all 0.12s",
                    textAlign: "center",
                    whiteSpace: "nowrap"
                  },
                  children: txt
                }, v, false);
              })]
            }, key, true)), /*#__PURE__*/_jsxDEV("div", {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: 4,
                alignItems: "center"
              },
              children: [/*#__PURE__*/_jsxDEV("div", {
                style: {
                  fontSize: 10,
                  fontWeight: 700,
                  color: C.g500,
                  marginBottom: 2
                },
                children: "設定温度"
              }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                onClick: () => setInfo("preSetTemp", String(Math.min(30, parseFloat(form.preSetTemp || 20) + 1))),
                style: {
                  width: 48,
                  height: 40,
                  borderRadius: 10,
                  border: "1.5px solid " + C.g200,
                  cursor: "pointer",
                  fontSize: 20,
                  fontWeight: 700,
                  background: C.white,
                  color: C.g600
                },
                children: "＋"
              }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                onClick: () => setS1Focus(s1Focus === "preSetTemp" ? null : "preSetTemp"),
                style: {
                  width: 80,
                  padding: "8px 6px",
                  borderRadius: 10,
                  cursor: "pointer",
                  border: "2px solid " + (s1Focus === "preSetTemp" ? C.blue : form.preSetTemp ? C.green : C.g200),
                  background: s1Focus === "preSetTemp" ? "#EFF6FF" : C.inp,
                  textAlign: "center",
                  fontFamily: "monospace",
                  fontSize: 22,
                  fontWeight: 800,
                  color: form.preSetTemp ? C.navy : C.g300,
                  transition: "all 0.12s"
                },
                children: [form.preSetTemp || "—", /*#__PURE__*/_jsxDEV("br", {}, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                  style: {
                    fontSize: 9,
                    fontWeight: 400,
                    color: C.g400
                  },
                  children: "°C"
                }, void 0, false)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
                onClick: () => setInfo("preSetTemp", String(Math.max(16, parseFloat(form.preSetTemp || 20) - 1))),
                style: {
                  width: 48,
                  height: 40,
                  borderRadius: 10,
                  border: "1.5px solid " + C.g200,
                  cursor: "pointer",
                  fontSize: 20,
                  fontWeight: 700,
                  background: C.white,
                  color: C.g600
                },
                children: "－"
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true)]
        }, void 0, true)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        style: {
          marginTop: 10,
          display: "flex",
          gap: 8
        },
        children: [/*#__PURE__*/_jsxDEV("button", {
          onClick: handleStep1TmpSave,
          disabled: !step1Valid,
          style: {
            flex: 1,
            padding: "14px",
            borderRadius: 12,
            border: step1Valid ? "2px solid " + C.teal : "2px solid " + C.g200,
            cursor: step1Valid ? "pointer" : "not-allowed",
            fontSize: 14,
            fontWeight: 700,
            background: step1Valid ? "#F0FDF4" : C.g100,
            color: step1Valid ? C.teal : C.g400
          },
          children: "💾 一次保存"
        }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
          onClick: goToStep2,
          disabled: !step1Valid,
          style: {
            flex: 2,
            padding: "14px",
            borderRadius: 12,
            border: "none",
            cursor: step1Valid ? "pointer" : "not-allowed",
            fontSize: 15,
            fontWeight: 700,
            background: step1Valid ? "linear-gradient(135deg," + C.navy + "," + C.blue + ")" : C.g200,
            color: step1Valid ? C.white : C.g400,
            boxShadow: step1Valid ? "0 4px 14px rgba(37,99,176,0.35)" : "none",
            letterSpacing: "0.04em"
          },
          children: step1Valid ? "次へ：測定データ入力　→" : "未入力（" + [s1DateDone, s1InspDone, s1DevDone].filter(v => !v).length + "項目）"
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
      style: {
        width: 210,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        background: C.g50,
        borderLeft: "2px solid " + C.g200,
        padding: "10px 8px",
        gap: 6
      },
      children: [/*#__PURE__*/_jsxDEV("div", {
        style: {
          background: C.white,
          borderRadius: 10,
          padding: "8px 10px",
          border: "2px solid " + (s1Focus ? C.blue : C.g200),
          minHeight: 52,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          transition: "border-color 0.15s"
        },
        children: [/*#__PURE__*/_jsxDEV("div", {
          style: {
            fontSize: 10,
            fontWeight: 700,
            color: C.g400,
            letterSpacing: "0.04em"
          },
          children: s1Focus === "preSetTemp" ? "設定温度を入力中" : s1Focus === "devSearch" ? "検索ワードを入力" : "検索窓または設定温度をタップ"
        }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
          style: {
            fontFamily: "monospace",
            fontSize: 22,
            fontWeight: 800,
            textAlign: "right",
            lineHeight: 1.2,
            color: s1Focus ? C.navy : C.g300,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          },
          children: s1Focus === "preSetTemp" ? form.preSetTemp || /*#__PURE__*/_jsxDEV("span", {
            style: {
              color: C.g200
            },
            children: "—"
          }, void 0, false) : s1Focus === "devSearch" ? devSearch || /*#__PURE__*/_jsxDEV("span", {
            style: {
              fontSize: 13,
              color: C.g300
            },
            children: "入力してください"
          }, void 0, false) : /*#__PURE__*/_jsxDEV("span", {
            style: {
              fontSize: 13
            },
            children: "—"
          }, void 0, false)
        }, void 0, false)]
      }, void 0, true), [[7, 8, 9], [4, 5, 6], [1, 2, 3], [0, "."]].map((row, ri) => /*#__PURE__*/_jsxDEV("div", {
        style: {
          display: "flex",
          gap: 5
        },
        children: row.map(k => /*#__PURE__*/_jsxDEV("button", {
          disabled: !s1Focus,
          onMouseDown: e => e.preventDefault(),
          onClick: () => {
            if (s1Focus === "preSetTemp") {
              const prev = String(form.preSetTemp || "");
              let next;
              if (k === ".") {
                next = prev.includes(".") ? prev : (prev || "0") + ".";
              } else if (prev === "0") {
                next = String(k);
              } else {
                next = prev.length < 4 ? prev + k : prev;
              }
              setInfo("preSetTemp", next);
            } else if (s1Focus === "devSearch") {
              setDevSearch(p => p + String(k));
            }
          },
          style: {
            flex: ri === 3 && k === 0 ? 2 : 1,
            height: 52,
            borderRadius: 10,
            border: "none",
            cursor: s1Focus ? "pointer" : "default",
            fontWeight: 800,
            fontFamily: "monospace",
            fontSize: 22,
            background: s1Focus ? C.white : C.g100,
            color: s1Focus ? C.g800 : C.g300,
            boxShadow: s1Focus ? "0 2px 5px rgba(0,0,0,0.09)" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.1s"
          },
          children: k
        }, k, false))
      }, ri, false)), /*#__PURE__*/_jsxDEV("div", {
        style: {
          display: "flex",
          gap: 5
        },
        children: [/*#__PURE__*/_jsxDEV("button", {
          disabled: !s1Focus,
          onMouseDown: e => e.preventDefault(),
          onClick: () => {
            if (s1Focus === "preSetTemp") setInfo("preSetTemp", String(form.preSetTemp || "").slice(0, -1));else if (s1Focus === "devSearch") setDevSearch(p => p.slice(0, -1));
          },
          style: {
            flex: 1,
            height: 48,
            borderRadius: 10,
            border: "none",
            cursor: s1Focus ? "pointer" : "default",
            fontSize: 18,
            fontWeight: 800,
            background: s1Focus ? C.g200 : C.g100,
            color: s1Focus ? C.g600 : C.g300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          },
          children: "⌫"
        }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
          disabled: !s1Focus,
          onMouseDown: e => e.preventDefault(),
          onClick: () => {
            if (s1Focus === "preSetTemp") {
              setInfo("preSetTemp", "");
              setS1Focus(null);
            } else if (s1Focus === "devSearch") {
              setDevSearch("");
              setS1Focus(null);
            }
          },
          style: {
            flex: 1,
            height: 48,
            borderRadius: 10,
            border: "none",
            cursor: s1Focus ? "pointer" : "default",
            fontSize: 14,
            fontWeight: 800,
            background: s1Focus ? "#FEF2F2" : C.g100,
            color: s1Focus ? C.red : C.g300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          },
          children: "CLR"
        }, void 0, false)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        style: {
          marginTop: "auto",
          padding: "4px",
          fontSize: 11,
          color: C.g400,
          textAlign: "center",
          lineHeight: 1.6
        },
        children: ["検索窓または", /*#__PURE__*/_jsxDEV("br", {}, void 0, false), "設定温度をタップ"]
      }, void 0, true)]
    }, void 0, true)]
  }, void 0, true);
}
export default function App() {
  const [view, setView] = useState("session"); // セッション開始画面から
  const [step, setStep] = useState(1);
  const [undoneOnly, setUndoneOnly] = useState(false); // 未入力分のみ表示
  const [sessionInfo, setSessionInfo] = useState(() => {
    try {
      const saved = localStorage.getItem("acSessionInfo");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }); // {date, inspector, targetFloors:[], roomAccess:{}}
  const [form, setForm] = useState(emptyForm());
  const [records, setRecords] = useState([]);
  const [editIdx, setEditIdx] = useState(null);
  const [flash, setFlash] = useState("");
  const [limits, setLimits] = useState(defLim());
  const [tmpLim, setTmpLim] = useState(defLim());
  const [vis, setVis] = useState(defVis());
  const [tmpVis, setTmpVis] = useState(defVis());
  const [devList, setDevList] = useState([]);
  const [inspList, setInspList] = useState([]);
  const [lastInsp, setLastInsp] = useState("");
  const [lastDate, setLastDate] = useState(new Date().toISOString().slice(0, 10));
  const [devSearch, setDevSearch] = useState("");
  const [openSec, setOpenSec] = useState({
    device: true,
    inspector: true,
    vis: false,
    lim: false
  });
  const [numDisp, setNumDisp] = useState("");
  const isOvr = useRef(false);
  const [activeCode, setActiveCode] = useState(null);
  const rowRefs = useRef({});
  const listRef = useRef();
  const devRef = useRef();
  const inspRef = useRef();
  useEffect(() => {
    if (view === "settings") {
      setTmpLim(JSON.parse(JSON.stringify(limits)));
      setTmpVis(JSON.parse(JSON.stringify(vis)));
    }
  }, [view]);
  const showFlash = msg => {
    setFlash(msg);
    setTimeout(() => setFlash(""), 2400);
  };
  const visIn = INDOOR_FIELDS.filter(f => vis[f.code]);
  const visOut = OUTDOOR_FIELDS.filter(f => vis[f.code]);
  const visFields = ALL_FIELDS.filter(f => vis[f.code]);
  const complete = visFields.every(f => form.values[f.code] !== "");
  const missing = visFields.filter(f => form.values[f.code] === "").length;
  const setInfo = (k, v) => setForm(p => ({
    ...p,
    [k]: v
  }));
  const setVal = (code, v) => setForm(p => ({
    ...p,
    values: {
      ...p.values,
      [code]: v
    }
  }));

  // Step1 state
  const s1DateDone = !!form.inspectionDate;
  const s1InspDone = !!form.inspector;
  const s1DevDone = !!(form.managementNo && form.unitNo && form.floor && form.room);
  const step1Valid = s1DateDone && s1InspDone && s1DevDone;
  const scrollToCenter = (code, smooth = true) => {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const el = rowRefs.current[code];
      const ct = listRef.current;
      if (!el || !ct) return;
      let top = 0,
        node = el;
      while (node && node !== ct) {
        top += node.offsetTop;
        node = node.offsetParent;
      }
      ct.scrollTo({
        top: Math.max(0, top - ct.clientHeight / 2 + el.offsetHeight / 2),
        behavior: smooth ? "smooth" : "instant"
      });
    }));
  };
  const onPress = key => {
    if (!activeCode) return;
    setNumDisp(prev => {
      if (key === "C") {
        isOvr.current = false;
        return "";
      }
      if (key === "⌫") {
        isOvr.current = false;
        return prev.slice(0, -1);
      }
      if (isOvr.current) {
        isOvr.current = false;
        return key === "." ? "0." : String(key);
      }
      if (key === ".") {
        if (prev.includes(".")) return prev;
        return (prev || "0") + ".";
      }
      if (prev === "0") return String(key);
      return prev + key;
    });
  };
  const onConfirm = () => {
    if (!activeCode || numDisp === "") return;
    setVal(activeCode, numDisp);
    const idx = visFields.findIndex(f => f.code === activeCode);
    const next = visFields[idx + 1];
    if (next) {
      setActiveCode(next.code);
      setNumDisp(form.values[next.code] || "");
      isOvr.current = true;
      scrollToCenter(next.code);
    } else {
      setActiveCode(null);
      setNumDisp("");
      isOvr.current = false;
    }
  };
  const moveActive = dir => {
    if (!activeCode) {
      if (visFields.length > 0) {
        const f = visFields[0];
        setActiveCode(f.code);
        setNumDisp(form.values[f.code] || "");
        isOvr.current = true;
        scrollToCenter(f.code, true);
      }
      return;
    }
    const idx = visFields.findIndex(f => f.code === activeCode);
    const next = visFields[idx + dir];
    if (!next) return;
    if (numDisp !== "") setVal(activeCode, numDisp);
    scrollToCenter(next.code, false);
    setActiveCode(next.code);
    setNumDisp(form.values[next.code] || "");
    isOvr.current = true;
  };
  const onRowClick = f => {
    if (activeCode && numDisp !== "") setVal(activeCode, numDisp);
    setActiveCode(f.code);
    setNumDisp(form.values[f.code] || "");
    isOvr.current = true;
    scrollToCenter(f.code);
  };
  const goToStep2 = () => {
    if (!step1Valid) return;
    const first = visFields[0];
    setStep(2);
    setActiveCode(first?.code || null);
    setNumDisp(first ? form.values[first.code] || "" : "");
    isOvr.current = true;
    if (first) scrollToCenter(first.code);
  };
  const [saveModal, setSaveModal] = useState(null); // 保存完了モーダル用データ
  const [measZoom, setMeasZoom] = useState(false); // 測定データ拡大表示

  const handleSave = (mode = "next") => {
    if (!complete) return;
    setLastInsp(form.inspector);
    setLastDate(form.inspectionDate);
    const saved = {
      ...form
    };
    if (editIdx !== null) {
      setRecords(p => p.map((r, i) => i === editIdx ? saved : r));
      setEditIdx(null);
    } else {
      setRecords(p => [...p, saved]);
    }
    setSaveModal({
      ...saved,
      _mode: mode
    }); // モーダル表示
  };
  // ① 次へ：測定データ入力 → 保存後そのまま測定データ入力画面へ
  const closeSaveNext = () => {
    const insp = saveModal?.inspector || form.inspector;
    const date = saveModal?.inspectionDate || form.inspectionDate;
    setSaveModal(null);
    setForm(emptyForm(insp, date));
    setStep(1);
    setActiveCode(null);
    setNumDisp("");
    isOvr.current = false;
  };
  // ② 一次保存 → 点検日・点検者はそのまま、機器情報リセットして基本情報へ
  const closeSaveTmp = () => {
    const insp = saveModal?.inspector || form.inspector;
    const date = saveModal?.inspectionDate || form.inspectionDate;
    setSaveModal(null);
    setForm(p => ({
      ...emptyForm(insp, date),
      inspector: insp,
      inspectionDate: date
    }));
    setStep(1);
    setActiveCode(null);
    setNumDisp("");
    isOvr.current = false;
  };
  const handleEdit = i => {
    setForm({
      ...records[i]
    });
    setEditIdx(i);
    setStep(1);
    setView("form");
  };
  const handleDel = i => {
    if (!window.confirm("削除しますか？")) return;
    setRecords(p => p.filter((_, j) => j !== i));
    if (editIdx === i) {
      setEditIdx(null);
      setForm(emptyForm(lastInsp, lastDate));
    }
  };
  const loadXLSX = () => new Promise((resolve, reject) => {
    if (window.XLSX) {
      resolve(window.XLSX);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    s.onload = () => resolve(window.XLSX);
    s.onerror = reject;
    document.head.appendChild(s);
  });
  const readFile = (file, onParsed) => {
    const isXlsx = /\.xlsx?$/i.test(file.name);
    const reader = new FileReader();
    if (isXlsx) {
      reader.onload = async ev => {
        const XLSX = await loadXLSX();
        const wb = XLSX.read(ev.target.result, {
          type: "array"
        });
        const ws = wb.Sheets[wb.SheetNames[0]];
        // シートの全セルを行×列の2次元配列として取得
        const rows = XLSX.utils.sheet_to_csv(ws);
        onParsed(rows);
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = ev => {
        const bytes = new Uint8Array(ev.target.result);
        const hasUtf8Bom = bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF;
        const enc = hasUtf8Bom ? "UTF-8" : "Shift_JIS";
        const text = new TextDecoder(enc).decode(bytes);
        onParsed(text.replace(/^\uFEFF/, ""));
      };
      reader.readAsArrayBuffer(file);
    }
  };
  const handleDevCSV = e => {
    const f = e.target.files[0];
    if (!f) return;
    readFile(f, text => {
      const l = parseDevCSV(text);
      setDevList(l);
      showFlash("✅ 機器リスト " + l.length + "件 読込");
    });
    e.target.value = "";
  };
  const handleInspCSV = e => {
    const f = e.target.files[0];
    if (!f) return;
    readFile(f, text => {
      const l = parseInspCSV(text);
      setInspList(l);
      showFlash("✅ 点検者 " + l.length + "名 読込");
    });
    e.target.value = "";
  };
  const toggleSec = k => setOpenSec(p => ({
    ...p,
    [k]: !p[k]
  }));
  const vf = ALL_FIELDS.filter(f => vis[f.code]);
  const [listFilter, setListFilter] = useState("all"); // "all"|"done"|"undone"
  const [sortCol, setSortCol] = useState(null); // ソート列
  const [sortDir, setSortDir] = useState("asc");
  const [showStats, setShowStats] = useState(false); // 集計モーダル
  const [floorFilter, setFloorFilter] = useState(null); // 階フィルター（null=全階）

  const tRows = devList.length > 0 ? devList.map(d => {
    const rec = records.find(r => r.managementNo === d.managementNo && r.unitNo === d.unitNo);
    return {
      ...d,
      record: rec || null
    };
  }) : records.map(r => ({
    floor: r.floor,
    room: r.room,
    managementNo: r.managementNo,
    unitNo: r.unitNo,
    record: r
  }));
  const handleStep1TmpSave = () => {
    if (!step1Valid) return;
    const saved = {
      ...form,
      values: emptyVal()
    };
    setLastInsp(form.inspector);
    setLastDate(form.inspectionDate);
    if (editIdx !== null) {
      setRecords(p => p.map((r, i) => i === editIdx ? saved : r));
      setEditIdx(null);
    } else {
      const ex = records.findIndex(r => r.managementNo === form.managementNo && r.unitNo === form.unitNo);
      if (ex >= 0) setRecords(p => p.map((r, i) => i === ex ? saved : r));else setRecords(p => [...p, saved]);
    }
    setForm(p => ({
      ...emptyForm(p.inspector, p.inspectionDate),
      inspector: p.inspector,
      inspectionDate: p.inspectionDate
    }));
    showFlash("💾 一次保存しました");
  };

  // ─── STEP1 ────────────────────────────────────────────
  // STEP1 テンキー対象フィールド
  const [s1Focus, setS1Focus] = useState(null); // 'date'|'inspector'|'device'|'preSetTemp'

  // Step1View → top-level component

  // フィルター適用
  const filteredRows = tRows.filter(row => {
    if (floorFilter && row.floor !== floorFilter) return false;
    if (listFilter === "done") return !!row.record && Object.values(row.record.values).some(v => v !== "");
    if (listFilter === "undone") return !row.record || !Object.values(row.record.values).some(v => v !== "");
    return true;
  });

  // 集計（階別）
  const _floors = [...new Set(tRows.map(r => r.floor).filter(Boolean))].sort();
  const floorStats = _floors.map(f => {
    const rows = tRows.filter(r => r.floor === f);
    const done = rows.filter(r => r.record && Object.values(r.record.values).some(v => v !== "")).length;
    return {
      floor: f,
      total: rows.length,
      done,
      undone: rows.length - done
    };
  });
  const modeLabel = m => ({
    "冷房": "❄️ 冷房",
    "暖房": "🔥 暖房",
    "送風": "💨 送風",
    "除湿": "💧 除湿"
  })[m] || m || "—";
  const windLabel = w => ({
    "自動": "🔄 自動",
    "弱": "💨 弱",
    "強": "💨 強",
    "急風": "🌪️ 急風"
  })[w] || w || "—";
  const closeNext = saveModal && saveModal._mode === "tmp" ? closeSaveTmp : closeSaveNext;
  const closeTmp = saveModal && saveModal._mode === "tmp" ? closeSaveNext : closeSaveTmp;
  const nextLabel = saveModal && saveModal._mode === "tmp" ? "→ 基本情報へ" : "→ 次の機器へ";

  // ─── render ───────────────────────────────────────────
  return /*#__PURE__*/_jsxDEV("div", {
    style: {
      fontFamily: "Hiragino Sans, Meiryo, Arial, sans-serif",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: C.g100,
      color: C.g800,
      overflow: "hidden",
      fontSize: 16
    },
    children: [/*#__PURE__*/_jsxDEV("style", {
      children: PS
    }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
      style: {
        background: "linear-gradient(135deg," + C.navy + " 0%," + C.blue + " 100%)",
        color: C.white,
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 54,
        flexShrink: 0,
        boxShadow: "0 2px 10px rgba(0,0,0,0.25)"
      },
      children: [/*#__PURE__*/_jsxDEV("div", {
        style: {
          fontWeight: 700,
          fontSize: 17,
          letterSpacing: "0.04em"
        },
        children: "🌡️ エアコン点検システム"
      }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
        style: {
          display: "flex",
          gap: 8
        },
        children: [/*#__PURE__*/_jsxDEV("button", {
          onClick: () => setShowStats(true),
          disabled: tRows.length === 0,
          style: {
            padding: "7px 14px",
            borderRadius: 7,
            border: "1.5px solid rgba(255,255,255,0.4)",
            cursor: tRows.length > 0 ? "pointer" : "not-allowed",
            fontSize: 13,
            fontWeight: 700,
            background: "rgba(255,255,255,0.15)",
            color: C.white,
            opacity: tRows.length > 0 ? 1 : 0.5
          },
          children: "📊 集計"
        }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
          onClick: () => doExport(records, vis),
          disabled: !records.length,
          style: {
            padding: "7px 14px",
            borderRadius: 7,
            border: "1.5px solid rgba(255,255,255,0.4)",
            cursor: records.length ? "pointer" : "not-allowed",
            fontSize: 13,
            fontWeight: 700,
            background: "rgba(255,255,255,0.15)",
            color: C.white,
            opacity: records.length ? 1 : 0.5
          },
          children: "💾 CSV"
        }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
          onClick: () => setView("session"),
          style: {
            padding: "8px 14px",
            borderRadius: 8,
            border: "1.5px solid rgba(255,255,255,0.4)",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            background: view === "session" ? C.white : "rgba(255,255,255,0.18)",
            color: view === "session" ? C.navy : C.white
          },
          children: "🗓️ 点検開始"
        }, void 0, false), [["form", "📝 入力"], ["list", "📋 一覧" + (records.length > 0 ? " (" + records.length + ")" : "")], ["settings", "⚙️ 設定"]].map(([v, label]) => /*#__PURE__*/_jsxDEV("button", {
          onClick: () => {
            setView(v);
            if (v === "form" && editIdx === null) setStep(1);
          },
          style: {
            padding: "8px 18px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 700,
            background: view === v ? C.white : "rgba(255,255,255,0.18)",
            color: view === v ? C.navy : C.white
          },
          children: label
        }, v, false))]
      }, void 0, true)]
    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
      style: {
        flex: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      },
      children: [view === "session" && /*#__PURE__*/_jsxDEV(SessionView, {
        devList: devList,
        inspList: inspList,
        records: records,
        sessionInfo: sessionInfo,
        setSessionInfo: setSessionInfo,
        undoneOnly: undoneOnly,
        setUndoneOnly: setUndoneOnly,
        onStart: info => {
          setSessionInfo(info);
          setForm(p => ({
            ...p,
            inspectionDate: info.date,
            inspector: info.inspector
          }));
          setLastInsp(info.inspector);
          setLastDate(info.date);
          setView("form");
          setStep(1);
        }
      }, void 0, false), view === "form" && /*#__PURE__*/_jsxDEV("div", {
        style: {
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column"
        },
        children: [/*#__PURE__*/_jsxDEV("div", {
          style: {
            display: "flex",
            alignItems: "center",
            padding: "12px 20px 0",
            gap: 0,
            flexShrink: 0
          },
          children: [{
            n: 1,
            label: "機器選択"
          }, {
            n: 2,
            label: "測定データ"
          }].map((s, i) => /*#__PURE__*/_jsxDEV("div", {
            style: {
              display: "flex",
              alignItems: "center",
              flex: i < 1 ? "none" : 1
            },
            children: [/*#__PURE__*/_jsxDEV("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: s.n < step ? "pointer" : "default"
              },
              onClick: () => s.n < step && setStep(s.n),
              children: [/*#__PURE__*/_jsxDEV("div", {
                style: {
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 15,
                  background: step === s.n ? "linear-gradient(135deg," + C.navy + "," + C.blue + ")" : step > s.n ? C.green : C.g200,
                  color: step >= s.n ? C.white : C.g400,
                  boxShadow: step === s.n ? "0 3px 10px rgba(37,99,176,0.4)" : "none"
                },
                children: step > s.n ? "✓" : s.n
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                style: {
                  fontWeight: 700,
                  fontSize: 15,
                  color: step === s.n ? C.navy : step > s.n ? C.green : C.g400
                },
                children: s.label
              }, void 0, false)]
            }, void 0, true), i < 1 && /*#__PURE__*/_jsxDEV("div", {
              style: {
                flex: 1,
                height: 3,
                background: step > 1 ? C.green : C.g200,
                margin: "0 14px",
                borderRadius: 2
              }
            }, void 0, false)]
          }, s.n, true))
        }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
          style: {
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            paddingTop: 8
          },
          children: step === 1 ? /*#__PURE__*/_jsxDEV(Step1View, {
            form: form,
            setInfo: setInfo,
            inspList: inspList,
            devList: devList,
            devSearch: devSearch,
            setDevSearch: setDevSearch,
            s1DateDone: s1DateDone,
            s1InspDone: s1InspDone,
            s1DevDone: s1DevDone,
            step1Valid: step1Valid,
            records: records,
            s1Focus: s1Focus,
            setS1Focus: setS1Focus,
            goToStep2: goToStep2,
            handleStep1TmpSave: handleStep1TmpSave,
            setForm: setForm,
            editIdx: editIdx,
            lastInsp: lastInsp,
            lastDate: lastDate,
            setStep: setStep,
            setView: setView,
            sessionInfo: sessionInfo,
            undoneOnly: undoneOnly,
            setUndoneOnly: setUndoneOnly
          }, void 0, false) : /*#__PURE__*/_jsxDEV(Step2View, {
            form: form,
            setInfo: setInfo,
            handleSave: handleSave,
            setStep: setStep,
            visIn: visIn,
            visOut: visOut,
            visFields: visFields,
            activeCode: activeCode,
            numDisp: numDisp,
            limits: limits,
            onPress: onPress,
            onConfirm: onConfirm,
            onRowClick: onRowClick,
            moveActive: moveActive,
            rowRefs: rowRefs,
            listRef: listRef,
            complete: complete,
            missing: missing,
            editIdx: editIdx,
            ALL_FIELDS: ALL_FIELDS,
            vis: vis,
            isAbn: isAbn
          }, void 0, false)
        }, void 0, false)]
      }, void 0, true), view === "list" && /*#__PURE__*/_jsxDEV("div", {
        style: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: "10px 16px"
        },
        children: [/*#__PURE__*/_jsxDEV("div", {
          style: {
            flexShrink: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8
          },
          children: [/*#__PURE__*/_jsxDEV("div", {
            style: {
              display: "flex",
              gap: 6,
              alignItems: "center"
            },
            children: [/*#__PURE__*/_jsxDEV("span", {
              style: {
                fontSize: 12,
                fontWeight: 700,
                color: C.g600
              },
              children: devList.length > 0 ? filteredRows.filter(r => r.record).length + "/" + tRows.length + "台" : records.length + "件"
            }, void 0, false), ["all", "done", "undone"].map(f => /*#__PURE__*/_jsxDEV("button", {
              onClick: () => setListFilter(f),
              style: {
                padding: "5px 10px",
                borderRadius: 7,
                border: "1.5px solid " + (listFilter === f ? C.blue : C.g200),
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 700,
                background: listFilter === f ? C.blue : C.white,
                color: listFilter === f ? C.white : C.g500
              },
              children: f === "all" ? "すべて" : f === "done" ? "入力済" : "未入力"
            }, f, false)), _floors.length > 0 && /*#__PURE__*/_jsxDEV("div", {
              style: {
                display: "flex",
                gap: 4,
                alignItems: "center",
                marginLeft: 6,
                paddingLeft: 8,
                borderLeft: "1.5px solid " + C.g200
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                style: {
                  fontSize: 10,
                  fontWeight: 700,
                  color: C.g400
                },
                children: "階："
              }, void 0, false), _floors.map(fl => /*#__PURE__*/_jsxDEV("button", {
                onClick: () => setFloorFilter(floorFilter === fl ? null : fl),
                style: {
                  padding: "4px 9px",
                  borderRadius: 6,
                  border: "1.5px solid " + (floorFilter === fl ? C.teal : C.g200),
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 700,
                  background: floorFilter === fl ? C.teal : C.white,
                  color: floorFilter === fl ? C.white : C.g600
                },
                children: fl
              }, fl, false)), floorFilter && /*#__PURE__*/_jsxDEV("button", {
                onClick: () => setFloorFilter(null),
                style: {
                  padding: "3px 7px",
                  borderRadius: 6,
                  border: "1.5px solid " + C.g300,
                  cursor: "pointer",
                  fontSize: 10,
                  fontWeight: 700,
                  background: C.g100,
                  color: C.g500
                },
                children: "解除"
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            style: {
              display: "flex",
              gap: 6
            },
            children: [/*#__PURE__*/_jsxDEV("button", {
              onClick: () => window.print(),
              style: {
                padding: "7px 12px",
                borderRadius: 7,
                border: "none",
                cursor: "pointer",
                background: C.teal,
                color: C.white,
                fontWeight: 700,
                fontSize: 12
              },
              children: "🖨️ 印刷"
            }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
              onClick: () => {
                setForm(emptyForm(lastInsp, lastDate));
                setEditIdx(null);
                setStep(1);
                setView("form");
              },
              style: {
                padding: "7px 12px",
                borderRadius: 7,
                border: "none",
                cursor: "pointer",
                background: C.blue,
                color: C.white,
                fontWeight: 700,
                fontSize: 12
              },
              children: "＋ 新規"
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true), floorFilter && /*#__PURE__*/_jsxDEV("div", {
          style: {
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 6,
            padding: "8px 14px",
            background: "linear-gradient(90deg," + C.teal + "18," + C.teal + "08)",
            border: "1.5px solid " + C.teal,
            borderRadius: 10
          },
          children: [/*#__PURE__*/_jsxDEV("span", {
            style: {
              fontSize: 13,
              fontWeight: 800,
              color: C.teal,
              flex: 1
            },
            children: ["🏢 ", floorFilter, " のみ表示中"]
          }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
            onClick: () => setFloorFilter(null),
            style: {
              padding: "5px 12px",
              borderRadius: 7,
              border: "1.5px solid " + C.teal,
              background: C.white,
              color: C.teal,
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 700
            },
            children: "✕ 解除"
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            onClick: () => setShowStats(true),
            style: {
              padding: "5px 12px",
              borderRadius: 7,
              border: "none",
              background: C.teal,
              color: C.white,
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 700
            },
            children: "📊 集計へ戻る"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          style: {
            flex: 1,
            overflowX: "auto",
            overflowY: "auto",
            background: C.white,
            borderRadius: 12,
            boxShadow: "0 2px 10px rgba(0,0,0,0.07)"
          },
          children: filteredRows.length === 0 ? /*#__PURE__*/_jsxDEV("div", {
            style: {
              padding: 60,
              textAlign: "center",
              color: C.g400
            },
            children: [/*#__PURE__*/_jsxDEV("div", {
              style: {
                fontSize: 36,
                marginBottom: 8
              },
              children: "📭"
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              style: {
                fontWeight: 700,
                fontSize: 14
              },
              children: listFilter === "undone" ? "未入力の機器はありません" : "データがありません"
            }, void 0, false)]
          }, void 0, true) : /*#__PURE__*/_jsxDEV("table", {
            style: {
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 12
            },
            children: [/*#__PURE__*/_jsxDEV("thead", {
              children: /*#__PURE__*/_jsxDEV("tr", {
                style: {
                  position: "sticky",
                  top: 0,
                  zIndex: 2
                },
                children: [["階", "部屋名", "管理番号", "機器番号", "状態", "点検日", "点検者", "運転", "モード", "設定温度"].map(h => {
                  const isSort = sortCol === h;
                  return /*#__PURE__*/_jsxDEV("th", {
                    onClick: () => {
                      if (sortCol === h) {
                        setSortDir(d => d === "asc" ? "desc" : "asc");
                      } else {
                        setSortCol(h);
                        setSortDir("asc");
                      }
                    },
                    style: {
                      background: isSort ? C.blue + "18" : C.g100,
                      color: isSort ? C.blue : C.g600,
                      padding: "8px 8px",
                      textAlign: "center",
                      fontWeight: 700,
                      fontSize: 10,
                      whiteSpace: "nowrap",
                      borderBottom: "2px solid " + C.g200,
                      cursor: "pointer",
                      userSelect: "none"
                    },
                    children: [h, isSort ? sortDir === "asc" ? " ▲" : " ▼" : ""]
                  }, h, true);
                }), vf.map((f, fi) => /*#__PURE__*/_jsxDEV("th", {
                  style: {
                    background: C.g100,
                    padding: "8px 6px",
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: 10,
                    whiteSpace: "nowrap",
                    borderBottom: "2px solid " + C.g200,
                    color: f.group === "indoor" ? C.blue : C.teal,
                    borderLeft: fi === 0 ? "2px solid " + C.g200 : undefined
                  },
                  children: [f.code, /*#__PURE__*/_jsxDEV("br", {}, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                    style: {
                      fontSize: 8,
                      fontWeight: 400
                    },
                    children: f.unit
                  }, void 0, false)]
                }, f.code, true)), /*#__PURE__*/_jsxDEV("th", {
                  style: {
                    background: C.g100,
                    color: C.g600,
                    padding: "8px 8px",
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: 10,
                    borderBottom: "2px solid " + C.g200,
                    borderLeft: "2px solid " + C.g200
                  },
                  children: "備考"
                }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                  style: {
                    background: C.g100,
                    color: C.g600,
                    padding: "8px 8px",
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: 10,
                    borderBottom: "2px solid " + C.g200
                  },
                  children: "操作"
                }, void 0, false)]
              }, void 0, true)
            }, void 0, false), /*#__PURE__*/_jsxDEV("tbody", {
              children: filteredRows.map((row, i) => {
                const r = row.record;
                const has = !!r;
                const hasMeasure = has && Object.values(r.values).some(v => v !== "");
                const bg = !hasMeasure ? i % 2 === 0 ? "#FAFAFA" : "#F5F5F5" : i % 2 === 0 ? C.white : C.g50;
                const ri = r ? records.indexOf(r) : -1;
                return /*#__PURE__*/_jsxDEV("tr", {
                  style: {
                    opacity: hasMeasure ? 1 : 0.65
                  },
                  children: [[row.floor, row.room, row.managementNo, row.unitNo].map((v, j) => /*#__PURE__*/_jsxDEV("td", {
                    style: {
                      padding: "7px 8px",
                      textAlign: "center",
                      borderBottom: "1px solid " + C.g100,
                      background: bg,
                      fontSize: 11,
                      whiteSpace: "nowrap",
                      fontWeight: 600
                    },
                    children: v || "—"
                  }, j, false)), /*#__PURE__*/_jsxDEV("td", {
                    style: {
                      padding: "5px 6px",
                      textAlign: "center",
                      borderBottom: "1px solid " + C.g100,
                      background: bg
                    },
                    children: hasMeasure ? /*#__PURE__*/_jsxDEV("span", {
                      style: {
                        background: C.green + "22",
                        color: C.green,
                        fontWeight: 700,
                        fontSize: 10,
                        padding: "2px 7px",
                        borderRadius: 5
                      },
                      children: "入力済"
                    }, void 0, false) : /*#__PURE__*/_jsxDEV("span", {
                      style: {
                        background: "#FEF2F2",
                        color: C.red,
                        fontWeight: 700,
                        fontSize: 10,
                        padding: "2px 7px",
                        borderRadius: 5
                      },
                      children: "未入力"
                    }, void 0, false)
                  }, void 0, false), [r?.inspectionDate, r?.inspector, r?.preOperation, r?.preMode, r?.preSetTemp].map((v, j) => /*#__PURE__*/_jsxDEV("td", {
                    style: {
                      padding: "7px 8px",
                      textAlign: "center",
                      borderBottom: "1px solid " + C.g100,
                      background: bg,
                      fontSize: 11,
                      color: v ? C.g800 : C.g300
                    },
                    children: v || "—"
                  }, j, false)), vf.map((f, fi) => {
                    const val = r?.values[f.code] || "";
                    const ab = val ? isAbn(f.code, val, limits) : false;
                    return /*#__PURE__*/_jsxDEV("td", {
                      style: {
                        padding: "7px 7px",
                        textAlign: "right",
                        borderBottom: "1px solid " + C.g100,
                        background: ab ? "#FEF2F2" : bg,
                        fontFamily: "monospace",
                        fontSize: 11,
                        color: ab ? C.red : val ? C.g800 : C.g300,
                        borderLeft: fi === 0 ? "2px solid " + C.g200 : undefined
                      },
                      children: val || "—"
                    }, f.code, false);
                  }), /*#__PURE__*/_jsxDEV("td", {
                    style: {
                      padding: "7px 8px",
                      textAlign: "center",
                      borderBottom: "1px solid " + C.g100,
                      background: bg,
                      fontSize: 11,
                      borderLeft: "2px solid " + C.g200,
                      color: r?.remarks ? C.g800 : C.g300
                    },
                    children: r?.remarks || "—"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                    style: {
                      padding: "6px 6px",
                      textAlign: "center",
                      borderBottom: "1px solid " + C.g100,
                      background: bg
                    },
                    children: hasMeasure ? /*#__PURE__*/_jsxDEV("div", {
                      style: {
                        display: "flex",
                        gap: 3,
                        justifyContent: "center"
                      },
                      children: [/*#__PURE__*/_jsxDEV("button", {
                        onClick: () => handleEdit(ri),
                        style: {
                          padding: "3px 7px",
                          borderRadius: 4,
                          border: "none",
                          cursor: "pointer",
                          background: C.blue,
                          color: C.white,
                          fontSize: 10,
                          fontWeight: 700
                        },
                        children: "編集"
                      }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                        onClick: () => handleDel(ri),
                        style: {
                          padding: "3px 7px",
                          borderRadius: 4,
                          border: "none",
                          cursor: "pointer",
                          background: C.red,
                          color: C.white,
                          fontSize: 10,
                          fontWeight: 700
                        },
                        children: "削除"
                      }, void 0, false)]
                    }, void 0, true) : /*#__PURE__*/_jsxDEV("button", {
                      onClick: () => {
                        setForm(p => ({
                          ...emptyForm(lastInsp, lastDate),
                          floor: row.floor,
                          room: row.room,
                          managementNo: row.managementNo,
                          unitNo: row.unitNo
                        }));
                        setEditIdx(null);
                        setStep(1);
                        setView("form");
                      },
                      style: {
                        padding: "3px 7px",
                        borderRadius: 4,
                        border: "1.5px solid " + C.blue,
                        cursor: "pointer",
                        background: "white",
                        color: C.blue,
                        fontSize: 10,
                        fontWeight: 700
                      },
                      children: "入力"
                    }, void 0, false)
                  }, void 0, false)]
                }, i, true);
              })
            }, void 0, false)]
          }, void 0, true)
        }, void 0, false)]
      }, void 0, true), view === "settings" && /*#__PURE__*/_jsxDEV("div", {
        style: {
          flex: 1,
          overflowY: "auto",
          padding: "14px 22px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 840,
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box"
        },
        children: [{
          id: "device",
          title: "機器リスト CSV読込",
          icon: "📂",
          color: C.navy,
          badge: devList.length > 0 ? devList.length + "件" : null
        }, {
          id: "inspector",
          title: "点検者リスト CSV読込",
          icon: "👤",
          color: C.blue,
          badge: inspList.length > 0 ? inspList.length + "名" : null
        }, {
          id: "vis",
          title: "表示項目設定",
          icon: "👁️",
          color: C.teal,
          badge: null
        }, {
          id: "lim",
          title: "正常値範囲設定",
          icon: "⚙️",
          color: C.purple,
          badge: null
        }].map(({
          id,
          title,
          icon,
          color,
          badge
        }) => {
          const open = openSec[id];
          return /*#__PURE__*/_jsxDEV("div", {
            style: {
              background: C.white,
              borderRadius: 14,
              boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
              overflow: "hidden"
            },
            children: [/*#__PURE__*/_jsxDEV("button", {
              onClick: () => toggleSec(id),
              style: {
                width: "100%",
                padding: "16px 20px",
                background: open ? color : color + "12",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              },
              children: [/*#__PURE__*/_jsxDEV("div", {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 10
                },
                children: [/*#__PURE__*/_jsxDEV("span", {
                  style: {
                    fontSize: 18
                  },
                  children: icon
                }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                  style: {
                    fontSize: 16,
                    fontWeight: 700,
                    color: open ? C.white : color
                  },
                  children: title
                }, void 0, false), badge && /*#__PURE__*/_jsxDEV("span", {
                  style: {
                    fontSize: 12,
                    background: open ? "rgba(255,255,255,0.28)" : C.green,
                    color: C.white,
                    padding: "2px 9px",
                    borderRadius: 10,
                    fontWeight: 700
                  },
                  children: badge
                }, void 0, false)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                style: {
                  fontSize: 16,
                  color: open ? C.white : color,
                  transform: open ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s"
                },
                children: "▼"
              }, void 0, false)]
            }, void 0, true), open && /*#__PURE__*/_jsxDEV("div", {
              style: {
                padding: "18px 20px"
              },
              children: [id === "device" && /*#__PURE__*/_jsxDEV("div", {
                children: [/*#__PURE__*/_jsxDEV("p", {
                  style: {
                    fontSize: 13,
                    color: C.g500,
                    marginBottom: 12,
                    lineHeight: 1.6
                  },
                  children: ["フォーマット（1行目ヘッダー）：", /*#__PURE__*/_jsxDEV("code", {
                    style: {
                      background: C.g100,
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 12
                    },
                    children: "階,部屋名,管理番号,機器番号"
                  }, void 0, false)]
                }, void 0, true), /*#__PURE__*/_jsxDEV("input", {
                  ref: devRef,
                  type: "file",
                  accept: ".csv,.xlsx,.xls",
                  style: {
                    display: "none"
                  },
                  onChange: handleDevCSV
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    marginBottom: 12
                  },
                  children: [/*#__PURE__*/_jsxDEV("button", {
                    onClick: () => devRef.current.click(),
                    style: {
                      padding: "11px 22px",
                      borderRadius: 9,
                      border: "none",
                      cursor: "pointer",
                      background: C.blue,
                      color: C.white,
                      fontWeight: 700,
                      fontSize: 14
                    },
                    children: "📁 CSVを選択"
                  }, void 0, false), devList.length > 0 && /*#__PURE__*/_jsxDEV("span", {
                    style: {
                      fontSize: 13,
                      color: C.green,
                      fontWeight: 700
                    },
                    children: ["✅ ", devList.length, "件読込済"]
                  }, void 0, true)]
                }, void 0, true), devList.length > 0 && /*#__PURE__*/_jsxDEV("table", {
                  style: {
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 13
                  },
                  children: [/*#__PURE__*/_jsxDEV("thead", {
                    children: /*#__PURE__*/_jsxDEV("tr", {
                      children: ["階", "部屋名", "管理番号", "機器番号"].map(h => /*#__PURE__*/_jsxDEV("th", {
                        style: {
                          background: C.g100,
                          padding: "7px 10px",
                          textAlign: "center",
                          fontWeight: 700,
                          fontSize: 11,
                          color: C.g500,
                          borderBottom: "2px solid " + C.g200
                        },
                        children: h
                      }, h, false))
                    }, void 0, false)
                  }, void 0, false), /*#__PURE__*/_jsxDEV("tbody", {
                    children: [devList.slice(0, 5).map((d, i) => /*#__PURE__*/_jsxDEV("tr", {
                      children: [d.floor, d.room, d.managementNo, d.unitNo].map((v, j) => /*#__PURE__*/_jsxDEV("td", {
                        style: {
                          padding: "7px 10px",
                          textAlign: "center",
                          borderBottom: "1px solid " + C.g100,
                          background: i % 2 === 0 ? C.white : C.g50
                        },
                        children: v
                      }, j, false))
                    }, i, false)), devList.length > 5 && /*#__PURE__*/_jsxDEV("tr", {
                      children: /*#__PURE__*/_jsxDEV("td", {
                        colSpan: 4,
                        style: {
                          padding: "7px",
                          textAlign: "center",
                          color: C.g400,
                          fontSize: 12
                        },
                        children: ["…他 ", devList.length - 5, "件"]
                      }, void 0, true)
                    }, void 0, false)]
                  }, void 0, true)]
                }, void 0, true)]
              }, void 0, true), id === "inspector" && /*#__PURE__*/_jsxDEV("div", {
                children: [/*#__PURE__*/_jsxDEV("p", {
                  style: {
                    fontSize: 13,
                    color: C.g500,
                    marginBottom: 12
                  },
                  children: "フォーマット：1行に1名（ヘッダーなし）"
                }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
                  ref: inspRef,
                  type: "file",
                  accept: ".csv,.xlsx,.xls",
                  style: {
                    display: "none"
                  },
                  onChange: handleInspCSV
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    flexWrap: "wrap"
                  },
                  children: [/*#__PURE__*/_jsxDEV("button", {
                    onClick: () => inspRef.current.click(),
                    style: {
                      padding: "11px 22px",
                      borderRadius: 9,
                      border: "none",
                      cursor: "pointer",
                      background: C.blue,
                      color: C.white,
                      fontWeight: 700,
                      fontSize: 14
                    },
                    children: "📁 CSVを選択"
                  }, void 0, false), inspList.length > 0 && /*#__PURE__*/_jsxDEV("span", {
                    style: {
                      fontSize: 13,
                      color: C.green,
                      fontWeight: 700
                    },
                    children: ["✅ ", inspList.join("・")]
                  }, void 0, true)]
                }, void 0, true)]
              }, void 0, true), id === "vis" && /*#__PURE__*/_jsxDEV("div", {
                children: [/*#__PURE__*/_jsxDEV("p", {
                  style: {
                    fontSize: 13,
                    color: C.g500,
                    marginBottom: 14
                  },
                  children: "チェックを外した項目は入力フォーム・一覧から非表示になります。"
                }, void 0, false), [{
                  fields: INDOOR_FIELDS,
                  label: "室内機（インドア）",
                  color: C.blue
                }, {
                  fields: OUTDOOR_FIELDS,
                  label: "室外機（アウトドア）",
                  color: C.teal
                }].map(({
                  fields,
                  label,
                  color
                }) => /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    marginBottom: 18
                  },
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    style: {
                      fontWeight: 700,
                      fontSize: 13,
                      color,
                      borderBottom: "2px solid " + color,
                      paddingBottom: 5,
                      marginBottom: 10
                    },
                    children: label
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      gap: 4
                    },
                    children: fields.map(f => /*#__PURE__*/_jsxDEV("label", {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "10px 14px",
                        borderRadius: 9,
                        background: tmpVis[f.code] ? color + "0A" : C.g50,
                        border: "1.5px solid " + (tmpVis[f.code] ? color : C.g200),
                        cursor: "pointer"
                      },
                      children: [/*#__PURE__*/_jsxDEV("input", {
                        type: "checkbox",
                        checked: tmpVis[f.code],
                        onChange: e => setTmpVis(p => ({
                          ...p,
                          [f.code]: e.target.checked
                        })),
                        style: {
                          width: 18,
                          height: 18,
                          accentColor: color,
                          cursor: "pointer"
                        }
                      }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                        style: {
                          fontFamily: "monospace",
                          fontWeight: 700,
                          color,
                          fontSize: 14,
                          minWidth: 34
                        },
                        children: f.code
                      }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                        style: {
                          fontSize: 15,
                          color: C.g600,
                          flex: 1
                        },
                        children: f.label
                      }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                        style: {
                          fontSize: 11,
                          color: C.g400,
                          background: C.g100,
                          padding: "2px 8px",
                          borderRadius: 5
                        },
                        children: f.unit
                      }, void 0, false)]
                    }, f.code, true))
                  }, void 0, false)]
                }, label, true)), /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    display: "flex",
                    gap: 10,
                    marginTop: 4
                  },
                  children: [/*#__PURE__*/_jsxDEV("button", {
                    onClick: () => {
                      setVis({
                        ...tmpVis
                      });
                      showFlash("✅ 表示設定を保存しました");
                    },
                    style: {
                      padding: "11px 26px",
                      borderRadius: 9,
                      border: "none",
                      cursor: "pointer",
                      background: C.teal,
                      color: C.white,
                      fontWeight: 700,
                      fontSize: 14
                    },
                    children: "保存する"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                    onClick: () => setTmpVis(defVis()),
                    style: {
                      padding: "11px 16px",
                      borderRadius: 9,
                      border: "1.5px solid " + C.g200,
                      cursor: "pointer",
                      background: C.white,
                      color: C.g500,
                      fontSize: 13
                    },
                    children: "全選択"
                  }, void 0, false)]
                }, void 0, true)]
              }, void 0, true), id === "lim" && /*#__PURE__*/_jsxDEV("div", {
                children: [/*#__PURE__*/_jsxDEV("p", {
                  style: {
                    fontSize: 13,
                    color: C.g500,
                    marginBottom: 14
                  },
                  children: "✅ をチェックすると最小・最大の入力欄が表示されます。"
                }, void 0, false), [{
                  fields: INDOOR_FIELDS,
                  label: "室内機（インドア）",
                  color: C.blue
                }, {
                  fields: OUTDOOR_FIELDS,
                  label: "室外機（アウトドア）",
                  color: C.teal
                }].map(({
                  fields,
                  label,
                  color
                }) => /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    marginBottom: 18
                  },
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    style: {
                      fontWeight: 700,
                      fontSize: 13,
                      color,
                      borderBottom: "2px solid " + color,
                      paddingBottom: 5,
                      marginBottom: 10
                    },
                    children: label
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      gap: 4
                    },
                    children: fields.map(f => /*#__PURE__*/_jsxDEV("div", {
                      style: {
                        borderRadius: 10,
                        overflow: "hidden",
                        border: "1.5px solid " + (tmpLim[f.code]?.enabled ? C.purple : C.g200)
                      },
                      children: [/*#__PURE__*/_jsxDEV("label", {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          padding: "10px 14px",
                          background: tmpLim[f.code]?.enabled ? C.purple + "0A" : C.g50,
                          cursor: "pointer"
                        },
                        children: [/*#__PURE__*/_jsxDEV("input", {
                          type: "checkbox",
                          checked: !!tmpLim[f.code]?.enabled,
                          onChange: e => setTmpLim(p => ({
                            ...p,
                            [f.code]: {
                              ...p[f.code],
                              enabled: e.target.checked
                            }
                          })),
                          style: {
                            width: 18,
                            height: 18,
                            accentColor: C.purple,
                            cursor: "pointer"
                          }
                        }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                          style: {
                            fontFamily: "monospace",
                            fontWeight: 700,
                            color,
                            fontSize: 14,
                            minWidth: 34
                          },
                          children: f.code
                        }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                          style: {
                            fontSize: 15,
                            color: C.g600,
                            flex: 1
                          },
                          children: f.label
                        }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                          style: {
                            fontSize: 11,
                            color: C.g400,
                            background: C.g100,
                            padding: "2px 8px",
                            borderRadius: 5
                          },
                          children: f.unit
                        }, void 0, false)]
                      }, void 0, true), tmpLim[f.code]?.enabled && /*#__PURE__*/_jsxDEV("div", {
                        style: {
                          padding: "12px 14px 14px 46px",
                          background: C.white,
                          display: "flex",
                          gap: 12,
                          alignItems: "center",
                          borderTop: "1px solid " + C.g200
                        },
                        children: [/*#__PURE__*/_jsxDEV("span", {
                          style: {
                            fontSize: 13,
                            color: C.g500,
                            minWidth: 36
                          },
                          children: "最小"
                        }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
                          type: "number",
                          step: f.step,
                          placeholder: "—",
                          value: tmpLim[f.code]?.min || "",
                          onChange: e => setTmpLim(p => ({
                            ...p,
                            [f.code]: {
                              ...p[f.code],
                              min: e.target.value
                            }
                          })),
                          style: {
                            width: 90,
                            padding: "8px 10px",
                            borderRadius: 7,
                            border: "1.5px solid " + C.g200,
                            fontSize: 15,
                            fontFamily: "monospace",
                            textAlign: "right",
                            outline: "none"
                          }
                        }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                          style: {
                            fontSize: 13,
                            color: C.g300
                          },
                          children: "〜"
                        }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                          style: {
                            fontSize: 13,
                            color: C.g500,
                            minWidth: 36
                          },
                          children: "最大"
                        }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
                          type: "number",
                          step: f.step,
                          placeholder: "—",
                          value: tmpLim[f.code]?.max || "",
                          onChange: e => setTmpLim(p => ({
                            ...p,
                            [f.code]: {
                              ...p[f.code],
                              max: e.target.value
                            }
                          })),
                          style: {
                            width: 90,
                            padding: "8px 10px",
                            borderRadius: 7,
                            border: "1.5px solid " + C.g200,
                            fontSize: 15,
                            fontFamily: "monospace",
                            textAlign: "right",
                            outline: "none"
                          }
                        }, void 0, false)]
                      }, void 0, true)]
                    }, f.code, true))
                  }, void 0, false)]
                }, label, true)), /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    display: "flex",
                    gap: 10,
                    marginTop: 4
                  },
                  children: [/*#__PURE__*/_jsxDEV("button", {
                    onClick: () => {
                      setLimits(JSON.parse(JSON.stringify(tmpLim)));
                      showFlash("✅ 正常値範囲を保存しました");
                    },
                    style: {
                      padding: "11px 26px",
                      borderRadius: 9,
                      border: "none",
                      cursor: "pointer",
                      background: C.purple,
                      color: C.white,
                      fontWeight: 700,
                      fontSize: 14
                    },
                    children: "保存する"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                    onClick: () => setTmpLim(defLim()),
                    style: {
                      padding: "11px 16px",
                      borderRadius: 9,
                      border: "1.5px solid " + C.g200,
                      cursor: "pointer",
                      background: C.white,
                      color: C.g500,
                      fontSize: 13
                    },
                    children: "リセット"
                  }, void 0, false)]
                }, void 0, true)]
              }, void 0, true)]
            }, void 0, true)]
          }, id, true);
        })
      }, void 0, false)]
    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
      id: "print-area",
      style: {
        display: "none"
      },
      children: [/*#__PURE__*/_jsxDEV("style", {
        children: PS
      }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
        style: {
          fontFamily: "Hiragino Sans, Meiryo, sans-serif"
        },
        children: [/*#__PURE__*/_jsxDEV("h2", {
          style: {
            textAlign: "center",
            fontSize: 14,
            marginBottom: 10
          },
          children: "エアコン点検データ一覧"
        }, void 0, false), /*#__PURE__*/_jsxDEV("table", {
          style: {
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 8
          },
          children: [/*#__PURE__*/_jsxDEV("thead", {
            children: /*#__PURE__*/_jsxDEV("tr", {
              style: {
                background: "#1B3A6B",
                color: "white"
              },
              children: ["階", "部屋名", "管理番号", "機器番号", "点検日", "点検者", "運転", "モード", "設定温度", ...vf.map(f => f.code + "(" + f.unit + ")"), "備考"].map((h, i) => /*#__PURE__*/_jsxDEV("th", {
                style: {
                  border: "1px solid #ccc",
                  padding: "3px 4px",
                  textAlign: "center",
                  fontSize: 7
                },
                children: h
              }, i, false))
            }, void 0, false)
          }, void 0, false), /*#__PURE__*/_jsxDEV("tbody", {
            children: (devList.length > 0 ? devList.map(d => {
              const rec = records.find(r => r.managementNo === d.managementNo && r.unitNo === d.unitNo);
              return {
                dev: d,
                rec
              };
            }) : records.map(r => ({
              dev: {
                floor: r.floor,
                room: r.room,
                managementNo: r.managementNo,
                unitNo: r.unitNo
              },
              rec: r
            }))).map(({
              dev,
              rec
            }, i) => /*#__PURE__*/_jsxDEV("tr", {
              style: {
                background: i % 2 === 0 ? "white" : "#f8fafc"
              },
              children: [[dev.floor, dev.room, dev.managementNo, dev.unitNo, rec?.inspectionDate || "", rec?.inspector || "", rec?.preOperation || "", rec?.preMode || "", rec?.preSetTemp || ""].map((v, j) => /*#__PURE__*/_jsxDEV("td", {
                style: {
                  border: "1px solid #ddd",
                  padding: "3px 4px",
                  textAlign: "center",
                  fontSize: 7
                },
                children: v
              }, j, false)), vf.map(f => {
                const val = rec?.values[f.code] || "";
                const ab = val ? isAbn(f.code, val, limits) : false;
                return /*#__PURE__*/_jsxDEV("td", {
                  style: {
                    border: "1px solid #ddd",
                    padding: "3px 4px",
                    textAlign: "right",
                    fontSize: 7,
                    color: ab ? "red" : undefined,
                    fontWeight: ab ? "bold" : undefined
                  },
                  children: val || ""
                }, f.code, false);
              }), /*#__PURE__*/_jsxDEV("td", {
                style: {
                  border: "1px solid #ddd",
                  padding: "3px 4px",
                  fontSize: 7
                },
                children: rec?.remarks || ""
              }, void 0, false)]
            }, i, true))
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          style: {
            marginTop: 8,
            fontSize: 8,
            color: "#666"
          },
          children: ["出力：", new Date().toLocaleString("ja-JP")]
        }, void 0, true)]
      }, void 0, true)]
    }, void 0, true), showStats && /*#__PURE__*/_jsxDEV("div", {
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20
      },
      onClick: () => setShowStats(false),
      children: /*#__PURE__*/_jsxDEV("div", {
        style: {
          background: C.white,
          borderRadius: 20,
          width: "100%",
          maxWidth: 480,
          boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
          overflow: "hidden",
          maxHeight: "85vh",
          overflowY: "auto"
        },
        onClick: e => e.stopPropagation(),
        children: [/*#__PURE__*/_jsxDEV("div", {
          style: {
            background: "linear-gradient(135deg," + C.navy + "," + C.blue + ")",
            padding: "16px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          },
          children: [/*#__PURE__*/_jsxDEV("div", {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 10
            },
            children: [/*#__PURE__*/_jsxDEV("span", {
              style: {
                fontSize: 22
              },
              children: "📊"
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              style: {
                fontSize: 16,
                fontWeight: 800,
                color: C.white
              },
              children: "階別集計"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
            onClick: () => setShowStats(false),
            style: {
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: C.white,
              borderRadius: 8,
              width: 32,
              height: 32,
              cursor: "pointer",
              fontSize: 16,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            },
            children: "✕"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          style: {
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 10
          },
          children: (() => {
            const _fl = [...new Set(tRows.map(r => r.floor).filter(Boolean))].sort();
            const total = tRows.length;
            const totalDone = tRows.filter(r => r.record && Object.values(r.record.values).some(v => v !== "")).length;
            return /*#__PURE__*/_jsxDEV(_Fragment, {
              children: [/*#__PURE__*/_jsxDEV("div", {
                style: {
                  background: C.g50,
                  borderRadius: 12,
                  padding: "12px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "2px solid " + C.g200
                },
                children: [/*#__PURE__*/_jsxDEV("span", {
                  style: {
                    fontWeight: 700,
                    fontSize: 14,
                    color: C.navy
                  },
                  children: "合計"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    display: "flex",
                    gap: 16,
                    alignItems: "center"
                  },
                  children: [/*#__PURE__*/_jsxDEV("span", {
                    style: {
                      fontSize: 13,
                      color: C.g500
                    },
                    children: [total, "台"]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                    style: {
                      fontSize: 15,
                      fontWeight: 800,
                      color: C.green
                    },
                    children: [totalDone, "✓"]
                  }, void 0, true), total - totalDone > 0 && /*#__PURE__*/_jsxDEV("span", {
                    style: {
                      fontSize: 13,
                      fontWeight: 700,
                      color: C.red
                    },
                    children: ["未", total - totalDone]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      width: 80,
                      height: 8,
                      background: C.g200,
                      borderRadius: 4,
                      overflow: "hidden"
                    },
                    children: /*#__PURE__*/_jsxDEV("div", {
                      style: {
                        width: (total > 0 ? Math.round(totalDone / total * 100) : 0) + "%",
                        height: "100%",
                        background: C.green,
                        borderRadius: 4
                      }
                    }, void 0, false)
                  }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                    style: {
                      fontSize: 12,
                      color: C.g500,
                      minWidth: 34,
                      textAlign: "right"
                    },
                    children: [total > 0 ? Math.round(totalDone / total * 100) : 0, "%"]
                  }, void 0, true)]
                }, void 0, true)]
              }, void 0, true), _fl.map(fl => {
                const rows = tRows.filter(r => r.floor === fl);
                const done = rows.filter(r => r.record && Object.values(r.record.values).some(v => v !== "")).length;
                const pct = rows.length > 0 ? Math.round(done / rows.length * 100) : 0;
                return /*#__PURE__*/_jsxDEV("div", {
                  onClick: () => {
                    setFloorFilter(fl);
                    setListFilter("all");
                    setView("list");
                    setShowStats(false);
                  },
                  style: {
                    borderRadius: 10,
                    padding: "10px 16px",
                    border: "1.5px solid " + C.g200,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: C.white,
                    cursor: "pointer",
                    transition: "background 0.12s"
                  },
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    },
                    children: [/*#__PURE__*/_jsxDEV("span", {
                      style: {
                        fontWeight: 700,
                        fontSize: 14,
                        color: C.navy,
                        minWidth: 50
                      },
                      children: fl
                    }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                      style: {
                        fontSize: 10,
                        color: C.g400
                      },
                      children: "タップで絞込 →"
                    }, void 0, false)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      display: "flex",
                      gap: 12,
                      alignItems: "center",
                      flex: 1,
                      justifyContent: "flex-end"
                    },
                    children: [/*#__PURE__*/_jsxDEV("span", {
                      style: {
                        fontSize: 12,
                        color: C.g500
                      },
                      children: [rows.length, "台"]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                      style: {
                        fontSize: 14,
                        fontWeight: 800,
                        color: C.green
                      },
                      children: [done, "✓"]
                    }, void 0, true), rows.length - done > 0 && /*#__PURE__*/_jsxDEV("button", {
                      onClick: e => {
                        e.stopPropagation();
                        setFloorFilter(fl);
                        setListFilter("undone");
                        setView("list");
                        setShowStats(false);
                      },
                      style: {
                        fontSize: 11,
                        fontWeight: 700,
                        color: C.red,
                        background: "#FEF2F2",
                        border: "1.5px solid " + C.red,
                        borderRadius: 5,
                        padding: "1px 7px",
                        cursor: "pointer"
                      },
                      children: ["未", rows.length - done]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                      style: {
                        width: 72,
                        height: 7,
                        background: C.g200,
                        borderRadius: 4,
                        overflow: "hidden"
                      },
                      children: /*#__PURE__*/_jsxDEV("div", {
                        style: {
                          width: pct + "%",
                          height: "100%",
                          background: pct === 100 ? C.green : C.blue,
                          borderRadius: 4,
                          transition: "width 0.3s"
                        }
                      }, void 0, false)
                    }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                      style: {
                        fontSize: 12,
                        color: C.g500,
                        minWidth: 34,
                        textAlign: "right"
                      },
                      children: [pct, "%"]
                    }, void 0, true)]
                  }, void 0, true)]
                }, fl, true);
              }), _fl.length === 0 && /*#__PURE__*/_jsxDEV("div", {
                style: {
                  textAlign: "center",
                  padding: "24px 0",
                  color: C.g400,
                  fontSize: 13
                },
                children: "データがありません"
              }, void 0, false)]
            }, void 0, true);
          })()
        }, void 0, false)]
      }, void 0, true)
    }, void 0, false), flash && /*#__PURE__*/_jsxDEV("div", {
      style: {
        position: "fixed",
        bottom: 24,
        right: 24,
        background: C.green,
        color: C.white,
        padding: "12px 24px",
        borderRadius: 10,
        fontWeight: 700,
        fontSize: 15,
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        zIndex: 9999
      },
      children: flash
    }, void 0, false), saveModal && /*#__PURE__*/_jsxDEV("div", {
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20
      },
      children: /*#__PURE__*/_jsxDEV("div", {
        style: {
          background: C.white,
          borderRadius: 20,
          width: "100%",
          maxWidth: 560,
          boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
          overflow: "hidden",
          maxHeight: "90vh",
          overflowY: "auto"
        },
        children: [/*#__PURE__*/_jsxDEV("div", {
          style: {
            background: "linear-gradient(135deg," + C.green + ",#047857)",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          },
          children: [/*#__PURE__*/_jsxDEV("div", {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 10
            },
            children: [/*#__PURE__*/_jsxDEV("span", {
              style: {
                fontSize: 24
              },
              children: "✅"
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              children: [/*#__PURE__*/_jsxDEV("div", {
                style: {
                  fontSize: 16,
                  fontWeight: 800,
                  color: C.white
                },
                children: "保存しました"
              }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                style: {
                  fontSize: 11,
                  color: "rgba(255,255,255,0.8)",
                  marginTop: 1
                },
                children: [saveModal.floor, "\u3000", saveModal.room, "\u3000", saveModal.managementNo, " / ", saveModal.unitNo]
              }, void 0, true)]
            }, void 0, true)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
            onClick: closeNext,
            style: {
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: C.white,
              borderRadius: 8,
              width: 34,
              height: 34,
              cursor: "pointer",
              fontSize: 18,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            },
            children: "✕"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          style: {
            padding: "14px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 12
          },
          children: [/*#__PURE__*/_jsxDEV("div", {
            onClick: () => setMeasZoom(true),
            style: {
              background: C.g50,
              borderRadius: 10,
              padding: "10px 14px",
              cursor: "pointer",
              border: "2px solid " + C.g200,
              transition: "border-color 0.15s",
              userSelect: "none"
            },
            children: [/*#__PURE__*/_jsxDEV("div", {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8
              },
              children: [/*#__PURE__*/_jsxDEV("div", {
                style: {
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.g500
                },
                children: "📊 測定データ"
              }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                style: {
                  fontSize: 10,
                  color: C.blue,
                  fontWeight: 700
                },
                children: "タップで拡大 ▶"
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              style: {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))",
                gap: "4px 12px"
              },
              children: ALL_FIELDS.filter(f => vis[f.code] && saveModal.values[f.code] !== "").map(f => {
                const abn = isAbn(f.code, saveModal.values[f.code], limits);
                return /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    display: "flex",
                    alignItems: "baseline",
                    gap: 5,
                    padding: "3px 0",
                    borderBottom: "1px solid " + C.g200
                  },
                  children: [/*#__PURE__*/_jsxDEV("span", {
                    style: {
                      fontSize: 11,
                      fontFamily: "monospace",
                      fontWeight: 700,
                      color: f.group === "indoor" ? C.blue : C.teal,
                      minWidth: 24
                    },
                    children: f.code
                  }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                    style: {
                      fontSize: 10,
                      color: C.g500,
                      flex: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    },
                    children: f.label
                  }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                    style: {
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: "monospace",
                      color: abn ? C.red : C.navy,
                      whiteSpace: "nowrap"
                    },
                    children: [saveModal.values[f.code], /*#__PURE__*/_jsxDEV("span", {
                      style: {
                        fontSize: 9,
                        color: C.g400
                      },
                      children: [" ", f.unit]
                    }, void 0, true), abn && /*#__PURE__*/_jsxDEV("span", {
                      style: {
                        fontSize: 9,
                        color: C.red
                      },
                      children: " ⚠️"
                    }, void 0, false)]
                  }, void 0, true)]
                }, f.code, true);
              })
            }, void 0, false), saveModal.remarks && /*#__PURE__*/_jsxDEV("div", {
              style: {
                marginTop: 8,
                fontSize: 12,
                color: C.g600,
                borderTop: "1px solid " + C.g200,
                paddingTop: 6
              },
              children: ["備考: ", saveModal.remarks]
            }, void 0, true)]
          }, void 0, true), saveModal.preOperation || saveModal.preMode || saveModal.preWind || saveModal.preSetTemp ? /*#__PURE__*/_jsxDEV("div", {
            style: {
              background: "#FFF7ED",
              border: "2px solid #F59E0B",
              borderRadius: 12,
              padding: "14px 16px"
            },
            children: [/*#__PURE__*/_jsxDEV("div", {
              style: {
                fontSize: 13,
                fontWeight: 800,
                color: "#92400E",
                marginBottom: 10
              },
              children: "⚠️ リモコンを点検前の状態に戻してください"
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              style: {
                display: "flex",
                gap: 8,
                marginBottom: 12,
                flexWrap: "wrap"
              },
              children: [{
                show: !!saveModal.preOperation,
                label: "運転",
                val: saveModal.preOperation === "ON" ? "🟢 ON" : "⭕ OFF"
              }, {
                show: !!saveModal.preMode,
                label: "モード",
                val: modeLabel(saveModal.preMode)
              }, {
                show: !!saveModal.preWind,
                label: "風量",
                val: windLabel(saveModal.preWind)
              }, {
                show: !!saveModal.preSetTemp,
                label: "設定温度",
                val: saveModal.preSetTemp + "°C"
              }].filter(p => p.show).map(p => /*#__PURE__*/_jsxDEV("div", {
                style: {
                  flex: 1,
                  minWidth: 70,
                  background: C.white,
                  border: "2px solid #F59E0B",
                  borderRadius: 10,
                  padding: "8px 10px",
                  textAlign: "center"
                },
                children: [/*#__PURE__*/_jsxDEV("div", {
                  style: {
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#92400E",
                    marginBottom: 4
                  },
                  children: p.label
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#78350F",
                    fontFamily: p.label === "設定温度" ? "monospace" : "inherit"
                  },
                  children: p.val
                }, void 0, false)]
              }, p.label, true))
            }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
              onClick: closeNext,
              style: {
                width: "100%",
                padding: "16px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: "linear-gradient(135deg," + C.green + ",#047857)",
                color: C.white,
                fontWeight: 800,
                fontSize: 16,
                boxShadow: "0 3px 10px rgba(5,150,105,0.3)"
              },
              children: ["✅ 戻しました\u3000→\u3000", nextLabel]
            }, void 0, true)]
          }, void 0, true) : /*#__PURE__*/_jsxDEV("button", {
            onClick: closeNext,
            style: {
              width: "100%",
              padding: "16px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(135deg," + C.navy + "," + C.blue + ")",
              color: C.white,
              fontWeight: 800,
              fontSize: 16,
              boxShadow: "0 3px 10px rgba(37,99,176,0.3)"
            },
            children: ["✅ ", nextLabel]
          }, void 0, true)]
        }, void 0, true)]
      }, void 0, true)
    }, void 0, false), measZoom && saveModal && /*#__PURE__*/_jsxDEV("div", {
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        zIndex: 10001,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16
      },
      onClick: () => setMeasZoom(false),
      children: /*#__PURE__*/_jsxDEV("div", {
        style: {
          background: C.white,
          borderRadius: 20,
          width: "100%",
          maxWidth: 600,
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          overflow: "hidden",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column"
        },
        onClick: e => e.stopPropagation(),
        children: [/*#__PURE__*/_jsxDEV("div", {
          style: {
            background: "linear-gradient(135deg," + C.navy + "," + C.blue + ")",
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0
          },
          children: [/*#__PURE__*/_jsxDEV("div", {
            style: {
              fontSize: 15,
              fontWeight: 800,
              color: C.white
            },
            children: ["📊 測定データ\u3000", saveModal.floor, " ", saveModal.room]
          }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
            onClick: () => setMeasZoom(false),
            style: {
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: C.white,
              borderRadius: 8,
              width: 34,
              height: 34,
              cursor: "pointer",
              fontSize: 18,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            },
            children: "✕"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          style: {
            overflowY: "auto",
            padding: "12px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 3
          },
          children: [ALL_FIELDS.filter(f => vis[f.code] && saveModal.values[f.code] !== "").map(f => {
            const abn = isAbn(f.code, saveModal.values[f.code], limits);
            return /*#__PURE__*/_jsxDEV("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 10,
                background: abn ? "#FEF2F2" : f.group === "indoor" ? C.blue + "08" : C.teal + "08",
                border: "1.5px solid " + (abn ? C.red : f.group === "indoor" ? C.blue + "30" : C.teal + "30")
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                style: {
                  fontFamily: "monospace",
                  fontWeight: 800,
                  fontSize: 18,
                  color: f.group === "indoor" ? C.blue : C.teal,
                  minWidth: 34
                },
                children: f.code
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                style: {
                  fontSize: 15,
                  color: C.g600,
                  flex: 1
                },
                children: f.label
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                style: {
                  fontFamily: "monospace",
                  fontWeight: 800,
                  fontSize: 26,
                  color: abn ? C.red : C.navy
                },
                children: saveModal.values[f.code]
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                style: {
                  fontSize: 13,
                  color: C.g400,
                  minWidth: 38
                },
                children: [f.unit, abn && " ⚠️"]
              }, void 0, true)]
            }, f.code, true);
          }), saveModal.remarks && /*#__PURE__*/_jsxDEV("div", {
            style: {
              marginTop: 6,
              padding: "10px 14px",
              borderRadius: 10,
              background: C.g50,
              fontSize: 13,
              color: C.g600
            },
            children: ["備考: ", saveModal.remarks]
          }, void 0, true)]
        }, void 0, true)]
      }, void 0, true)
    }, void 0, false)]
  }, void 0, true);
}

// PWA用：BabelスタンドアロンがexportをWindowに展開しないため手動公開
window.__AC_APP__ = App;
})();