DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `openid` varchar(64) NOT NULL COMMENT '微信用户唯一身份',
  `uuid` varchar(32) NOT NULL COMMENT '用户全局身份',
  `appid` varchar(32) DEFAULT NULL COMMENT '微信appid，对应gapp表wxappid',
  `mobile` varchar(20) DEFAULT NULL,
  `name` varchar(32) DEFAULT NULL,
  `nickname` varchar(128) DEFAULT NULL,
  `sex` int(11) DEFAULT '0' COMMENT '1男 2女 0未知',
  `province` varchar(64) DEFAULT NULL,
  `city` varchar(64) DEFAULT NULL,
  `country` varchar(64) DEFAULT NULL,
  `headimgurl` text,
  `cardno` varchar(64) DEFAULT NULL COMMENT '会员卡号',
  `state` int(11) DEFAULT '0' COMMENT '0未关注，1已关注，2取消关注',
  `firstsubscribetime` datetime DEFAULT NULL COMMENT '首次关注时间',
  `subscribetime` datetime DEFAULT NULL COMMENT '关注时间',
  `createtime` datetime DEFAULT NULL,
  `lastmodify` datetime DEFAULT NULL,
  PRIMARY KEY (`openid`),
  KEY `NewIndex1` (`state`),
  KEY `NewIndex2` (`subscribetime`),
  KEY `NewIndex3` (`appid`),
  UNIQUE KEY `NewIndex4` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表';

DROP TABLE IF EXISTS `share_log`;
CREATE TABLE `share_log` (
  `uuid` varchar(32) NOT NULL COMMENT '表的主键',
  `openid` varchar(64) NOT NULL,
  `superid` varchar(64) NOT NULL COMMENT '分享上线用户openid',
  `scene` int(11) DEFAULT '0' COMMENT '分享渠道 0 未知 1 朋友 2 朋友圈',
  `url` text,
  `createtime` datetime DEFAULT NULL,
  PRIMARY KEY (`uuid`),
  KEY `NewIndex1` (`openid`),
  KEY `NewIndex2` (`superid`),
  KEY `NewIndex3` (`scene`),
  KEY `NewIndex4` (`createtime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='分享渠道日志';

DROP TABLE IF EXISTS `subscribe_log`;
CREATE TABLE `subscribe_log` (
  `uuid` varchar(32) NOT NULL COMMENT '表的主键',
  `openid` varchar(64) NOT NULL,
  `superid` varchar(64) NOT NULL COMMENT '关注上线用户openid',
  `createtime` datetime DEFAULT NULL,
  PRIMARY KEY (`uuid`),
  KEY `NewIndex1` (`openid`),
  KEY `NewIndex2` (`superid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='关注日志';