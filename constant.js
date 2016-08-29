module.exports = {
	TOKEN_URL: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}",
	USERINFO_URL: "https://api.weixin.qq.com/cgi-bin/user/info?access_token=${token}&openid=${openid}&lang=zh_CN",
	AUTH_TOKEN_URL: "https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${appsecret}&code=${code}&grant_type=authorization_code",
	JSAPI_TICKET_URL: "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi",
	OAUTH_BASE_URL: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=http%3A%2F%2F${hostname}%2Fwxnotify%2Foauth.do&response_type=code&scope=snsapi_base&state=${url}#wechat_redirect',
	ERROR_REQUEST: "-1000",
	ERROR_USER: "-1001",
	ERROR_PARAMS: "-1002",
	SNSAPI_USERINFO: "snsapi_userinfo",
	SIGNATURE_FORMAT: "jsapi_ticket=${ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}",
	CHARS: " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~!@#$%^&*()_+-=[]{}|;:?/0123456789",
	USER_CACHE_EXPIRES: 60 * 60 * 24
}
