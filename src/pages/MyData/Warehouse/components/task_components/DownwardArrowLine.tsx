export const DownwardArrowLine = (
    <div style={{ paddingLeft: 20, left: 50, top: 40 }}>
        {/* 总高度稍微高于线条高度以容纳箭头 */}
        <svg width="20" height="40" style={{ left: 50, color: "#bfbfbf" }} >
            {/* 竖直线，高度50 */}
            <line x1="10" y1="10" x2="10" y2="30" stroke="gray" strokeWidth="2" />
            {/* 朝下的箭头 */}
            <polygon points="5,30 15,30 10,38" fill="gray" />
        </svg>
    </div>
);