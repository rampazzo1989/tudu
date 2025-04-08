import { useCallback, useEffect, useRef, useState } from "react";
import { SimpleTuduList } from "../../../../components/simple-tudu-list";
import { TuduViewModel } from "../../../home/types";
import { TuduAdditionalInformation } from "../../../../components/tudu-card/types";
import { formatToLocaleDate, isOutdated } from "../../../../utils/date-utils";
import React from "react";
import { useListService } from "../../../../service/list-service-hook/useListService";
import { NewTuduModal } from "../../../../components/new-tudu-modal";
import { useCloseCurrentlyOpenSwipeable } from "../../../../hooks/useCloseAllSwipeables";
import { OutdatedTudusListProps } from "./types";
import { View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { TitleContainer, Title, ControlContainer, ButtonText } from "./styles";
import { useRecoilState } from "recoil";
import { showOutdatedTudus } from "../../../../state/atoms";
import { useTranslation } from "react-i18next";
import { WarningIcon } from "../../../../components/animated-icons/warning-icon";
import { AnimatedIconRef } from "../../../../components/animated-icons/animated-icon/types";

const OutdatedTudusList: React.FC<OutdatedTudusListProps> = ({ tudus, showUpToDateHeader = false }) => {
    const { t } = useTranslation();
    const [newTuduPopupVisible, setNewTuduPopupVisible] = useState(false);
    const [editingTudu, setEditingTudu] = useState<TuduViewModel>();
    const [showTudus, setShowTudus] = useRecoilState(showOutdatedTudus);
    const { saveTudu, deleteTudu, restoreBackup } = useListService();
    const { closeCurrentlyOpenSwipeable } = useCloseCurrentlyOpenSwipeable();
    const warningIconRef = useRef<AnimatedIconRef>(null);

    const getAdditionalInformation = useCallback(
        (tudu: TuduViewModel): TuduAdditionalInformation | undefined => {
            if (tudu.dueDate) {
                return {
                    label: formatToLocaleDate(tudu.dueDate),
                    originType: "scheduled",
                };
            }
        },
        []
    );

    useEffect(() => {
        if (!showTudus) {
            setTimeout(() => {
                warningIconRef.current?.play();
            }, 1000);
        }
    }, []); // Not referencing showTudus here so the animation only plays when the list is shown

    const handleSaveTudu = useCallback(
        (editingItem: TuduViewModel) => {
            if (editingItem.dueDate && isOutdated(editingItem.dueDate)) {
                editingItem.dueDate = new Date();
            }
            saveTudu(editingItem);
        },
        [saveTudu]
    );

    const handleEditPress = useCallback((tudu: TuduViewModel) => {
        setEditingTudu(tudu);
        setNewTuduPopupVisible(true);
    }, []);

    return (
        <Animated.View layout={LinearTransition}>
            <TitleContainer isShowingTudus={showTudus}>
                {!showTudus && <WarningIcon ref={warningIconRef} size={20} style={{ marginRight: 8 }} />}
                <Title>
                    {showTudus
                        ? t("outdatedTudusList.title.outdated")
                        : tudus.length === 1 
                            ? t("outdatedTudusList.title.countOne") 
                            : t("outdatedTudusList.title.countMany", { count: tudus.length })}
                </Title>
                <ControlContainer
                    onPress={() => setShowTudus((current) => !current)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <ButtonText>
                        {showTudus
                            ? t("outdatedTudusList.button.hide")
                            : t("outdatedTudusList.button.show")}
                    </ButtonText>
                </ControlContainer>
            </TitleContainer>
            {showTudus ? (
                <Animated.View layout={LinearTransition}>
                    <View style={{ marginBottom: 16 }}>
                        <SimpleTuduList
                            getAdditionalInformation={getAdditionalInformation}
                            tudus={tudus}
                            updateTuduFn={handleSaveTudu}
                            deleteTuduFn={deleteTudu}
                            undoDeletionFn={restoreBackup}
                            onEditPress={handleEditPress}
                        />
                    </View>
                    {showUpToDateHeader && (
                        <TitleContainer isShowingTudus={showTudus}>
                        <Title>{t("outdatedTudusList.title.upToDate")}</Title>
                        </TitleContainer>
                    )}
                </Animated.View>
            ) : null}
            <NewTuduModal
                visible={newTuduPopupVisible}
                onRequestClose={() => {
                    setNewTuduPopupVisible(false);
                    setEditingTudu(undefined);
                    closeCurrentlyOpenSwipeable();
                }}
                editingTudu={editingTudu}
                onInsertOrUpdate={handleSaveTudu}
            />
        </Animated.View>
    );
};

export { OutdatedTudusList };