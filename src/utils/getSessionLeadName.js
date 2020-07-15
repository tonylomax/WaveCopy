export default (surfLeadID, selectedSessionMentorsData) => {
  const SURFLEAD = selectedSessionMentorsData?.filter(
    (mentor) => mentor.id === surfLeadID,
  );
  return SURFLEAD[0];
};
