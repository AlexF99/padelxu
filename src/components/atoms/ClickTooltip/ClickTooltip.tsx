import { Chip, Tooltip } from "@mui/material"
import { useState } from "react";

interface Props {
    label: string,
    shortLabel: string,
}

const ClickTooltip = (props: Props) => {
    const { label, shortLabel } = props;
    const [open, setOpen] = useState(false);

    const handleTooltipClose = () => {
        setOpen(false);
    };

    const handleTooltipOpen = () => {
        setOpen(!open);
    };

    return (
        <Tooltip
            placement="top"
            title={label}
            onClose={handleTooltipClose}
            open={open}
            disableHoverListener
            disableTouchListener>
            <Chip label={shortLabel} onClick={handleTooltipOpen} />
        </Tooltip>
    )
}

export default ClickTooltip;