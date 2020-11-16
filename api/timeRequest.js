function timeRequest(str, reqStart) {
    const query_bd = new Date() - reqStart
    console.log('\x1b[36m%s\x1b[0m', `Request fom ${str}: ${query_bd}, ms`);
    return query_bd
}

module.exports = timeRequest