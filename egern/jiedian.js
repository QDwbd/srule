export default async function(ctx) {


  function getFlagEmoji(code) {

    if (!code) return "🌐";

    if(code.toUpperCase() === "TW"){
      code = "CN";
    }

    return String.fromCodePoint(
      ...code
      .toUpperCase()
      .split("")
      .map(
        c => 127397 + c.charCodeAt()
      )
    );

  }



  try {


    const url =
      "http://ip-api.com/json/?fields=8450015&lang=zh-CN";



    const res =
      await ctx.http.get(url);


    const data =
      await res.json();



    const flag =
      getFlagEmoji(
        data.countryCode
      );



    const theme = [

      "#EF4444",
      "#991B1B",
      "#450A0A"

    ];



    let children = [];



    const title = {

      type:"text",

      text:"📍 节点信息",

      font:{
        size:"headline",
        weight:"bold"
      },

      textColor:"#FFFFFF"

    };



    const ip = {

      type:"text",

      text:
      `${flag} 地区：${data.country} ${data.city}\n\n`+
      `🌐 IP：${data.query}`,

      font:{
        size:"title3",
        weight:"semibold"
      },

      textColor:"#FFFFFF"

    };



    const isp = {

      type:"text",

      text:
      `🖥 运营商：${data.isp}`,

      textColor:"#E5E7EB"

    };



    const asn = {

      type:"text",

      text:
      `#️⃣ ASN：${data.as}`,

      textColor:"#E5E7EB"

    };



    const location = {

      type:"text",

      text:
      `🕗 时区：${data.timezone}\n`+
      `📍 坐标：${data.lon}, ${data.lat}`,

      textColor:"#CBD5E1"

    };



    const currency = {

      type:"text",

      text:
      `🪙 货币：${data.currency || "未知"}`,

      textColor:"#CBD5E1"

    };



    if(ctx.widgetFamily === "systemSmall"){


      children = [

        title,

        ip

      ];


    }


    else if(
      ctx.widgetFamily === "systemMedium"
    ){


      children = [

        title,

        ip,

        isp,

        asn

      ];


    }


    else {


      children = [

        title,

        ip,

        isp,

        asn,

        location,

        currency

      ];

    }




    return {


      type:"widget",


      refreshAfter:

      new Date(
        Date.now()+30*60*1000
      ).toISOString(),



      padding:16,

      gap:8,



      backgroundGradient:{


        type:"linear",

        colors:theme,


        startPoint:{
          x:0,
          y:0
        },


        endPoint:{
          x:1,
          y:1
        }


      },


      children:children


    };



  } catch(e){


    return {


      type:"widget",

      padding:16,


      backgroundColor:"#111827",


      children:[

        {

          type:"text",

          text:"节点信息获取失败",

          textColor:"#F87171"

        },

        {

          type:"text",

          text:String(e),

          textColor:"#CBD5E1"

        }

      ]

    };


  }


}
