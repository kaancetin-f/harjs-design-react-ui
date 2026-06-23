"use client";

import React, { useEffect, useRef, useState } from "react";
import IProps from "./IProps";
import "../../../assets/css/components/charts/pie/pie.css";

const Pie: React.FC<IProps> = ({ title, data, size }) => {
  // refs
  const _arPieChart = useRef<HTMLDivElement>(null);
  // const _randomIndex = useRef<number[]>([]);

  // state
  const [conic, setConic] = useState<string[]>([]);

  // variables
  const conicColors = [
    ["#fff35e", "#000"], // Sarı
    ["#ffc752", "#000"], // Açık Sarı
    ["#ff9151", "#fff"], // Turuncu
    ["#ee544e", "#fff"], // Kırmızı
    ["#e52b66", "#fff"], // Pembemsi Kırmızı
    ["#3c1d43", "#fff"], // Koyu Mor
    ["#582d62", "#fff"], // Mor
    ["#0470a7", "#fff"], // Açık Mavi
    ["#068aa8", "#fff"], // Mavi-Turkuaz
    ["#72a9bb", "#fff"], // Açık Mavi-Gri
  ];

  useEffect(() => {
    if (!_arPieChart.current || data.length === 0) return;

    const conicGradients: string[] = [];
    let total = data.reduce((sum, value) => sum + value.value, 0);
    let normalizedData = data.map((value) => (value.value / total) * 100);
    let start = 0;

    // Gelen data uzunluğunda rastgele bir sayı dizisi oluşturuyor.
    // do {
    //   const r = Math.floor(Math.random() * conicColors.length);

    //   if (!_randomIndex.current.includes(r)) _randomIndex.current.push(r);
    // } while (_randomIndex.current.length < data.length);

    normalizedData.forEach((percent, index) => {
      let end = start + percent;

      if (index === 0) conicGradients.push(`#fff ${start + 0.5}% ${start}%`);
      conicGradients.push(`${conicColors[index][0]} ${start}% ${end}%`);
      conicGradients.push(`#fff ${end}% ${end + 0.5}%`);

      start = end;
    });

    setConic(conicGradients);
  }, [data]);

  return (
    <div className="ar-pie-chart-wrapper">
      <div className="title">
        <span>{title}</span>
      </div>

      <div>
        <div
          ref={_arPieChart}
          className="ar-pie-chart"
          style={{ background: `conic-gradient(${conic.join(", ")})`, width: size, height: size }}
        >
          <article>{/* Grafik yüzdesi burada olabilir */}</article>
        </div>

        <div className="information-field">
          {data.map((item, index) => (
            <article key={index}>
              <span style={{ backgroundColor: conicColors[index][0] }}>
                <span style={{ color: conicColors[index][1] }}>{item.value}</span>
              </span>
              <span>{item.text}</span>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pie;
