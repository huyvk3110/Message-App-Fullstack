import React, { useState } from "react";
import AvatarComponent from "./AvatarComponent";
import { IUserChatroomData } from "../interface/DataInterface";

function ItemConversationComponent({ data }: { data: IUserChatroomData }) {
    let { active, archive, block, notification, chatroom, user, _id: dataId } = data;
    let { _id: chatroomId, name, type, users, lastMessage } = chatroom;

    const [hover, setHover] = useState(false);

    return (
        <div
            className="conversation-item px-3 py-2"
            onMouseOver={() => { setHover(true) }}
            onMouseLeave={() => { setHover(false) }}
        >
            <div className="left">
                <AvatarComponent
                    // url={avatar}
                    size="medium"
                />
                <div className="info ml-2">
                    <p className="text-normal">{name}</p>
                    <div className="last-message" style={{visibility: lastMessage ? "visible" : "hidden"}}>
                        <p className="text-normal text-light">{`Bạn: ${lastMessage?.message}`}</p>
                        <p className="text-normal text-light"><span>· </span> 30 Tháng 7</p>
                    </div>
                </div>
            </div>
            <div className="right">
                {
                    hover ?
                        <button>
                            <i className="fa fa-ellipsis-h" />
                        </button>
                        :
                        <AvatarComponent
                            // url={avatarRead}
                            size="tiny"
                            className="d-inline-flex"
                        />
                }
            </div>
        </div>
    )
}

export default ItemConversationComponent