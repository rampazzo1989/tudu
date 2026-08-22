import { useCallback, useEffect, useRef, useState } from "react";
import { SimpleTuduList } from "../../../../components/simple-tudu-list";
import { TuduViewModel, RecurrenceType } from "../../../home/types";
import { TuduAdditionalInformation } from "../../../../components/tudu-card/types";
import {
  formatScheduledDateTime,
  isOutdated,
} from "../../../../utils/date-utils";
import React from "react";
import { useListService } from "../../../../service/list-service-hook/useListService";
import { NewTuduModal } from "../../../../components/new-tudu-modal";
import { useCloseCurrentlyOpenSwipeable } from "../../../../hooks/useCloseAllSwipeables";
import { OutdatedTudusListProps } from "./types";
import { View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import {
  BannerButton,
  BannerButtonText,
  BannerLeft,
  BannerTitle,
  OutdatedBanner,
  SectionHeaderRow,
  SectionHeaderTitle,
  ToggleButton,
  ToggleButtonText,
} from "./styles";
import { useRecoilState } from "recoil";
import { showOutdatedTudus } from "../../../../state/atoms";
import { useTranslation } from "react-i18next";
import { WarningIcon } from "../../../../components/animated-icons/warning-icon";
import { AnimatedIconRef } from "../../../../components/animated-icons/animated-icon/types";
import { ScheduleModal } from "../../../../components/schedule-modal";

const OutdatedTudusList: React.FC<OutdatedTudusListProps> = ({ tudus, showUpToDateHeader = false }) => {
    const { t } = useTranslation();
    const [newTuduPopupVisible, setNewTuduPopupVisible] = useState(false);
    const [editingTudu, setEditingTudu] = useState<TuduViewModel>();
    const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
    const [showTudus, setShowTudus] = useRecoilState(showOutdatedTudus);
    const { saveTudu, deleteTudu, restoreBackup } = useListService();
    const { closeCurrentlyOpenSwipeable } = useCloseCurrentlyOpenSwipeable();
    const warningIconRef = useRef<AnimatedIconRef>(null);

    const getAdditionalInformation = useCallback(
        (tudu: TuduViewModel): TuduAdditionalInformation | undefined => {
            if (tudu.dueDate) {
                return {
                    label: formatScheduledDateTime(tudu.dueDate, tudu.hasTime, t),
                    originType: "scheduled",
                };
            }
        },
        [t]
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
            if (editingItem.dueDate && isOutdated(editingItem.dueDate) && !editingItem.recurrence) {
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

    const handleTuduSchedulePress = useCallback((tudu: TuduViewModel) => {
        setEditingTudu(tudu);
        setScheduleModalVisible(true);
    }, []);

    const handleSchedule = useCallback((date: Date, hasTime?: boolean, recurrence?: RecurrenceType) => {
        if (editingTudu) {
            editingTudu.dueDate = date;
            editingTudu.hasTime = hasTime;
            editingTudu.recurrence = recurrence;
            handleSaveTudu(editingTudu);
        }
    }, [editingTudu, handleSaveTudu]);

    return (
        <Animated.View layout={LinearTransition}>
            {showTudus ? (
                <SectionHeaderRow>
                    <SectionHeaderTitle>
                        {t("outdatedTudusList.title.outdated")}
                    </SectionHeaderTitle>
                    <ToggleButton
                        onPress={() => setShowTudus(false)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <ToggleButtonText>
                            {t("outdatedTudusList.button.hide")}
                        </ToggleButtonText>
                    </ToggleButton>
                </SectionHeaderRow>
            ) : (
                <OutdatedBanner onPress={() => setShowTudus(true)}>
                    <BannerLeft>
                        <WarningIcon ref={warningIconRef} size={18} style={{ marginRight: 8 }} />
                        <BannerTitle numberOfLines={1}>
                            {tudus.length === 1
                                ? t("outdatedTudusList.title.countOne")
                                : t("outdatedTudusList.title.countMany", { count: tudus.length })}
                        </BannerTitle>
                    </BannerLeft>
                    <BannerButton>
                        <BannerButtonText>
                            {t("outdatedTudusList.button.show")}
                        </BannerButtonText>
                    </BannerButton>
                </OutdatedBanner>
            )}
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
                            onSchedulePress={handleTuduSchedulePress}
                        />
                    </View>
                    {showUpToDateHeader && (
                        <SectionHeaderRow style={{ marginTop: 12 }}>
                            <SectionHeaderTitle>{t("outdatedTudusList.title.upToDate")}</SectionHeaderTitle>
                        </SectionHeaderRow>
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
            <ScheduleModal
                isVisible={scheduleModalVisible}
                onModalClose={() => {
                    setScheduleModalVisible(false);
                    setEditingTudu(undefined);
                    setTimeout(closeCurrentlyOpenSwipeable, 500);
                }}
                onSchedule={handleSchedule}
                currentDate={editingTudu?.dueDate}
                hasTimeInitial={editingTudu?.hasTime}
                currentRecurrence={editingTudu?.recurrence}
            />
        </Animated.View>
    );
};

export { OutdatedTudusList };