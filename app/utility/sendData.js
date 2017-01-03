module.exports = async(
    params
) => {
    //асинхронная отправка данных куда нибудь
    const res = await new Promise((res, rej) => {
        console.log("send data: ", params);
        //захардкоженная версия мока
        setTimeout(() => {
            switch (params.summ) {
                case '400': {
                    console.info("rejected query");
                    rej({
                        code: 400,
                        error: "description error"
                    })
                    break;
                }
                default: {
                    console.info("success query");
                    res({
                        code: 200,
                        body: 'OK'
                    });
                }
            };
        }, 1000);
    });

    //какие-нибудь манипуляции с ответом

    return res;
};