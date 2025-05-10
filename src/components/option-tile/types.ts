export type BaseOptionTileProps = {
    label: string;
    onPress: () => void;
}

export type OptionTileProps = BaseOptionTileProps & {
    TopComponent?: React.FC;
}