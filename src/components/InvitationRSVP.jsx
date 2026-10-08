import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabaseEmployees } from "@/lib/supabaseEmployees";
export default function InvitationRSVP() {
  const { token } = useParams();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [responseChoice, setResponseChoice] = useState(null);
  const [participantCount, setParticipantCount] = useState(1);
  const [participants, setParticipants] = useState([]);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [declined, setDeclined] = useState(false);
  const [existingParticipantCount, setExistingParticipantCount] = useState(0);
  const [remainingSlots, setRemainingSlots] = useState(0);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  useEffect(() => {
    const fetchInvitation = async () => {
      setLoading(true);
      setError("");
      const { data, error } = await supabaseEmployees
        .from("event_invitations")
        .select(`
          *,
          events (
            id,
            title,
            description,
            event_date,
            location,
            banner_image_url,
            is_active
          ),
          event_invitation_participants (
            id
          )
        `)
        .eq("invitation_token", token)
        .single();
      if (error) {
        console.error(error);
        setError("Invitation not found or no longer available.");
        setLoading(false);
        return;
      }
      setInvitation(data);
      const registeredCount = data.event_invitation_participants?.length || 0;
      const remaining = Math.max(0, Number(data.participant_limit || 0) - registeredCount);
      setExistingParticipantCount(registeredCount);
      setRemainingSlots(remaining);
      setParticipantCount(remaining > 0 ? 1 : 0);
      setRegistrationComplete(remaining === 0);
      setSubmitted(false);
      setResponseChoice(null);
      setParticipants([]);
      setSubmitError("");
      setDeclined(data.status === "Declined");
      setLoading(false);
    };
fetchInvitation();
}, [token]);
const handleContinueParticipants = () => {
  if (participantCount < 1 || participantCount > remainingSlots) {
    setSubmitError(`You can only add up to ${remainingSlots} more participant${remainingSlots === 1 ? "" : "s"}.`);
    return;
  }
  setSubmitError("");
  const participantForms = Array.from({ length: participantCount }, () => ({
    full_name: "",
    contact_number: "",
    requires_air_travel: null,
    birthdate: "",
    valid_id_file: null,
  }));
  setParticipants(participantForms);
};
const handleParticipantChange = (index, field, value) => {
  setParticipants((prev) =>
    prev.map((participant, i) =>
      i === index ? { ...participant, [field]: value } : participant
    )
  );
};
const handleFileChange = (index, file) => {
  if (!file) return;
  setParticipants((prev) =>
    prev.map((participant, i) =>
      i === index ? { ...participant, valid_id_file: file } : participant
    )
  );
};
const validateParticipants = () => {
    for (let i = 0; i < participants.length; i++) {
      const participant = participants[i];
      const label = `Participant ${i + 1}`;
      if (!participant.full_name.trim()) return `Please enter the full name for ${label}.`;
      if (!participant.contact_number.trim()) return `Please enter the contact number for ${label}.`;
      if (participant.requires_air_travel === null) return `Please answer the air travel requirement for ${label}.`;
      if (participant.requires_air_travel && !participant.birthdate) return `Please enter the birthdate for ${label}.`;
      if (participant.requires_air_travel && !participant.valid_id_file) return `Please upload a valid ID for ${label}.`;
    }
    return "";
  };
  const handleSubmitInvitation = async () => {
    const validationError = validateParticipants();
    setSubmitError(validationError);
    if (validationError || !invitation) return;
    setSubmitting(true);
    try {
      const { data: currentParticipants, error: countError } = await supabaseEmployees
        .from("event_invitation_participants")
        .select("id")
        .eq("invitation_id", invitation.id);
      if (countError) throw countError;
      const currentCount = currentParticipants?.length || 0;
      const currentRemaining = Math.max(0, Number(invitation.participant_limit || 0) - currentCount);
      setExistingParticipantCount(currentCount);
      setRemainingSlots(currentRemaining);
      if (currentRemaining === 0) {
        setRegistrationComplete(true);
        setParticipants([]);
        setResponseChoice(null);
        throw new Error("All participant slots for this invitation have already been filled.");
      }
      if (participants.length > currentRemaining) {
        setParticipants([]);
        setParticipantCount(1);
        throw new Error(`Only ${currentRemaining} participant slot${currentRemaining === 1 ? "" : "s"} remaining. Please select again.`);
      }
      const rows = [];
      for (let i = 0; i < participants.length; i++) {
        const participant = participants[i];
        let validIdPath = null;
        if (participant.requires_air_travel && participant.valid_id_file) {
          const file = participant.valid_id_file;
          const ext = file.name.split(".").pop()?.toLowerCase() || "file";
          const safeExt = ext.replace(/[^a-z0-9]/g, "") || "file";
          const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
          const uploadPath = `${invitation.id}/${uniqueId}.${safeExt}`;
            const { data: uploadData, error: uploadError } = await supabaseEmployees.storage
              .from("event-valid-ids")
              .upload(uploadPath, file, { cacheControl: "3600", upsert: false });
            if (uploadError) throw uploadError;
            if (!uploadData?.path) throw new Error("Valid ID uploaded but no Storage path was returned.");
            validIdPath = uploadData.path;
        }
        rows.push({
          invitation_id: invitation.id,
          full_name: participant.full_name.trim(),
          contact_number: participant.contact_number.trim(),
          requires_air_travel: participant.requires_air_travel,
          birthdate: participant.requires_air_travel ? participant.birthdate : null,
          valid_id_url: validIdPath,
        });
      }
      const { error: insertError } = await supabaseEmployees.from("event_invitation_participants").insert(rows);
      if (insertError) throw insertError;
      const { error: updateError } = await supabaseEmployees
        .from("event_invitations")
        .update({ status: "Confirmed", responded_at: new Date().toISOString() })
        .eq("id", invitation.id)
        .eq("invitation_token", token);
      if (updateError) throw updateError;
      const newRegisteredCount = currentCount + participants.length;
      const newRemaining = Math.max(0, Number(invitation.participant_limit || 0) - newRegisteredCount);
      setInvitation((prev) => ({ ...prev, status: "Confirmed", responded_at: new Date().toISOString() }));
      setExistingParticipantCount(newRegisteredCount);
      setRemainingSlots(newRemaining);
      setRegistrationComplete(newRemaining === 0);
      setSubmitted(true);
      setSubmitError("");
    } catch (err) {
      console.error(err);
      setSubmitError(err?.message || "Unable to submit the invitation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
const handleDeclineInvitation = async () => {
  if (!invitation || submitting) return;
  if (existingParticipantCount > 0) {
    setResponseChoice(null);
    setSubmitError("This invitation already has registered participants and can no longer be declined. If you have concerns, please call or text 0968 856 4627.");
    return;
  }
  setSubmitError("");
  setSubmitting(true);
  try {
    const respondedAt = new Date().toISOString();
    const { data: updatedInvitation, error: declineError } =
      await supabaseEmployees
        .from("event_invitations")
        .update({
          status: "Declined",
          decline_reason: declineReason.trim() || null,
          responded_at: respondedAt,
        })
        .eq("invitation_token", token)
        .select()
        .maybeSingle();
    if (declineError) throw declineError;
    if (!updatedInvitation) {
      throw new Error(
        "No invitation row was updated. Check the invitation token or RLS policy."
      );
    }
    setInvitation((prev) => ({
      ...prev,
      ...updatedInvitation,
    }));
    setDeclined(true);
    setSubmitError("");
  } catch (err) {
    console.error("Decline invitation error:", err);
    setSubmitError(
      err?.message ||
        "Unable to decline the invitation. Please try again."
    );
  } finally {
    setSubmitting(false);
  }
};
  if (submitted) return (
    <div style={{ minHeight: "100vh", background: "#f6fbfe", display: "flex", justifyContent: "center", alignItems: "center", padding: 20, fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 600, background: "#fff", borderRadius: 20, padding: 30, textAlign: "center", boxShadow: "0 10px 40px rgba(1,63,153,0.08)" }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#013F99", marginBottom: 8 }}>{registrationComplete ? "Registration Complete" : "Participants Submitted"}</div>
        <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>
          {registrationComplete
            ? `All ${invitation?.participant_limit || 0} participant slots have been submitted successfully.`
            : `Your participant details have been submitted successfully. You still have ${remainingSlots} participant slot${remainingSlots === 1 ? "" : "s"} remaining.`}
        </div>
        {registrationComplete && <div style={{ marginTop: 18, padding: 14, background: "#f6fbfe", borderRadius: 10, fontSize: 12, color: "#64748b", lineHeight: 1.7 }}>If you have any concerns or need to make changes, please call or text <strong style={{ color: "#013F99" }}>0968 856 4627</strong>.</div>}
      </div>
    </div>
  );
  if (declined) return (
    <div style={{ minHeight: "100vh", background: "#f6fbfe", display: "flex", justifyContent: "center", alignItems: "center", padding: 20, boxSizing: "border-box", fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 600, background: "#fff", borderRadius: 20, padding: 30, boxSizing: "border-box", textAlign: "center", boxShadow: "0 10px 40px rgba(1,63,153,0.08)" }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#dc2626", marginBottom: 8 }}>Invitation Declined</div>
        <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>Thank you for letting us know. Your response has been recorded.</div>
      </div>
    </div>
  );
  if (!loading && !error && registrationComplete && invitation) return (
    <div style={{ minHeight: "100vh", background: "#f6fbfe", display: "flex", justifyContent: "center", alignItems: "center", padding: 20, boxSizing: "border-box", fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 600, background: "#fff", borderRadius: 20, padding: 30, boxSizing: "border-box", textAlign: "center", boxShadow: "0 10px 40px rgba(1,63,153,0.08)" }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#013F99", marginBottom: 8 }}>Registration Complete</div>
        <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>You have already submitted all <strong>{existingParticipantCount} of {invitation.participant_limit}</strong> participants for this invitation.</div>
        <div style={{ marginTop: 18, padding: 14, background: "#f6fbfe", borderRadius: 10, fontSize: 12, color: "#64748b", lineHeight: 1.7 }}>If you have any concerns or need to make changes to your submitted participant information, please call or text <strong style={{ color: "#013F99" }}>0968 856 4627</strong>.</div>
      </div>
    </div>
  );
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6fbfe",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        boxSizing: "border-box",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 600,
          background: "#fff",
          borderRadius: 20,
          padding: 30,
          boxSizing: "border-box",
          boxShadow: "0 10px 40px rgba(1,63,153,0.08)",
        }}
      >
        <h1 style={{ fontSize: 22, color: "#0b1a3b", margin: 0 }}>
          Custom Invitation
        </h1>
        <div
          style={{
            height: 3,
            background: "linear-gradient(90deg, #013F99, #4CB1E9, #F3CF47)",
            borderRadius: 2,
            margin: "14px 0 20px",
          }}
        />
        {loading ? (
          <p style={{ color: "#64748b", fontSize: 13 }}>Loading invitation...</p>
        ) : error ? (
          <p style={{ color: "#dc2626", fontSize: 13 }}>{error}</p>
        ) : (
          <>
            {invitation.events?.banner_image_url && (
              <div
                style={{
                  width: "100%",
                  aspectRatio: "3 / 1",
                  borderRadius: 12,
                  overflow: "hidden",
                  marginBottom: 20,
                  background: "#eef4f8",
                }}
              >
                <img
                  src={invitation.events.banner_image_url}
                  alt="Event heading"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            )}
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#0b1a3b",
                marginBottom: 8,
              }}
            >
              {invitation.events?.title}
            </div>
            {invitation.events?.event_date && (
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 5 }}>
                📅{" "}
                {new Date(invitation.events.event_date).toLocaleString("en-PH", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </div>
            )}
            {invitation.events?.location && (
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 15 }}>
                📍 {invitation.events.location}
              </div>
            )}
            <div
              style={{
                padding: 14,
                background: "#f6fbfe",
                borderRadius: 10,
                fontSize: 13,
                color: "#64748b",
              }}
            >
              This invitation allows a maximum of <strong style={{ color: "#013F99" }}>{invitation.participant_limit} {invitation.participant_limit === 1 ? "participant" : "participants"}</strong>.
              {existingParticipantCount > 0 && <div style={{ marginTop: 6 }}><strong style={{ color: "#16a34a" }}>{existingParticipantCount}</strong> already registered · <strong style={{ color: "#013F99" }}>{remainingSlots}</strong> remaining</div>}
            </div>
            {existingParticipantCount > 0 && remainingSlots > 0 && (
              <div style={{ marginTop: 12, padding: 12, background: "rgba(1,63,153,0.05)", border: "1px solid rgba(1,63,153,0.08)", borderRadius: 10, fontSize: 11, color: "#64748b", lineHeight: 1.6 }}>
                You may still add {remainingSlots} more participant{remainingSlots === 1 ? "" : "s"}. If you will no longer use the remaining slot{remainingSlots === 1 ? "" : "s"}, no further action is required. To cancel or change already submitted participants, please call or text <strong style={{ color: "#013F99" }}>0968 856 4627</strong>.
              </div>
            )}
            {!responseChoice && (
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <button
                  type="button"
                  onClick={() => setResponseChoice("accept")}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    border: "none",
                    borderRadius: 10,
                    background: "linear-gradient(90deg, #013F99, #4CB1E9)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {existingParticipantCount > 0 ? "Add Remaining Participants" : "Accept Invitation"}
                </button>
                {existingParticipantCount === 0 && <button
                  type="button"
                  onClick={() => setResponseChoice("decline")}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    border: "1px solid rgba(239,68,68,0.25)",
                    borderRadius: 10,
                    background: "#fff",
                    color: "#dc2626",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Decline
                </button>}
              </div>
            )}
            {/* DECLINE FORM */}
            {responseChoice === "decline" && (
              <div style={{ marginTop: 20, padding: 18, background: "#f6fbfe", borderRadius: 12, border: "1px solid rgba(239,68,68,0.15)" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0b1a3b", marginBottom: 6 }}>Decline Invitation</div>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 12 }}>You may tell us why you cannot attend. This is optional.</div>
                <label style={labelStyle}>Reason for declining (Optional)</label>
                <textarea value={declineReason} onChange={(e) => setDeclineReason(e.target.value)} placeholder="Enter reason..." rows={4} style={{ ...inputStyle, resize: "vertical", fontFamily: "'Poppins', sans-serif" }} />
                {submitError && <div style={{ marginTop: 12, padding: "11px 12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 8, color: "#dc2626", fontSize: 11 }}>{submitError}</div>}
                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <button type="button" disabled={submitting} onClick={() => { setResponseChoice(null); setDeclineReason(""); setSubmitError(""); }} style={{ flex: 1, padding: "11px 14px", border: "1px solid rgba(1,63,153,0.15)", borderRadius: 9, background: "#fff", color: "#64748b", fontSize: 12, fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer" }}>Back</button>
                  <button type="button" disabled={submitting} onClick={handleDeclineInvitation} style={{ flex: 1, padding: "11px 14px", border: "none", borderRadius: 9, background: "#dc2626", color: "#fff", fontSize: 12, fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}>{submitting ? "Submitting..." : "Submit Decline"}</button>
                </div>
              </div>
            )}
            {/***** NUMBER OF PARTICIPANTS *****/}
            {responseChoice === "accept" && participants.length === 0 && (
              <div
                style={{
                  marginTop: 20,
                  padding: 18,
                  background: "#f6fbfe",
                  borderRadius: 12,
                  border: "1px solid rgba(1,63,153,0.08)",
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#0b1a3b",
                    marginBottom: 6,
                  }}
                >
                  Number of Participants
                </div>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 12 }}>
                  {existingParticipantCount > 0
                    ? `You already registered ${existingParticipantCount} of ${invitation.participant_limit}. You may add up to ${remainingSlots} more.`
                    : `Select how many participants will attend. Maximum of ${remainingSlots}.`}
                </div>
                <select
                  value={participantCount}
                  onChange={(e) => setParticipantCount(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "11px 12px",
                    border: "1px solid rgba(1,63,153,0.18)",
                    borderRadius: 8,
                    background: "#fff",
                    color: "#0b1a3b",
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                >
                  {Array.from(
                    { length: remainingSlots },
                    (_, index) => index + 1
                  ).map((number) => (
                    <option key={number} value={number}>
                      {number} {number === 1 ? "Participant" : "Participants"}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleContinueParticipants}
                  style={{
                    width: "100%",
                    marginTop: 12,
                    padding: "12px 16px",
                    border: "none",
                    borderRadius: 9,
                    background: "linear-gradient(90deg, #013F99, #4CB1E9)",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={() => setResponseChoice(null)}
                  style={{
                    marginTop: 12,
                    padding: 0,
                    border: "none",
                    background: "transparent",
                    color: "#64748b",
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                >
                  ← Back
                </button>
              </div>
            )}
            {/***** PARTICIPANT FORMS *****/}
            {responseChoice === "accept" && participants.length > 0 && (
              <div style={{ marginTop: 20 }}>
                {participants.map((participant, index) => (
                  <div
                    key={index}
                    style={{
                      padding: 16,
                      marginBottom: 12,
                      background: "#f6fbfe",
                      borderRadius: 12,
                      border: "1px solid rgba(1,63,153,0.08)",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#013F99" }}>
                      Participant {index + 1}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        marginTop: 14,
                      }}
                    >
                      <div>
                        <label style={labelStyle}>Full Name</label>
                        <input
                          type="text"
                          value={participant.full_name}
                          onChange={(e) =>
                            handleParticipantChange(index, "full_name", e.target.value)
                          }
                          placeholder="Enter full name"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Contact Number</label>
                        <input
                          type="tel"
                          value={participant.contact_number}
                          onChange={(e) =>
                            handleParticipantChange(index, "contact_number", e.target.value)
                          }
                          placeholder="e.g. 0917 123 4567"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={{ ...labelStyle, marginBottom: 7 }}>
                          Requires Air Travel?
                        </label>
                        <div style={{ display: "flex", gap: 10 }}>
                          <button
                            type="button"
                            onClick={() =>
                              handleParticipantChange(index, "requires_air_travel", true)
                            }
                            style={toggleStyle(participant.requires_air_travel === true)}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleParticipantChange(index, "requires_air_travel", false)
                            }
                            style={toggleStyle(participant.requires_air_travel === false)}
                          >
                            No
                          </button>
                        </div>
                        {participant.requires_air_travel === true && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 12,
                              marginTop: 12,
                            }}
                          >
                            <div>
                              <label style={labelStyle}>Birthdate</label>
                              <input
                                type="date"
                                value={participant.birthdate}
                                onChange={(e) =>
                                  handleParticipantChange(index, "birthdate", e.target.value)
                                }
                                style={inputStyle}
                              />
                            </div>
                            <div>
                              <label style={labelStyle}>Upload Valid ID</label>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,application/pdf"
                                onChange={(e) => handleFileChange(index, e.target.files?.[0] || null)}
                                style={{
                                  width: "100%",
                                  padding: "10px",
                                  border: "1px solid rgba(1,63,153,0.15)",
                                  borderRadius: 8,
                                  fontSize: 12,
                                  boxSizing: "border-box",
                                  background: "#fff",
                                }}
                              />
                              <div
                                style={{ fontSize: 10, color: "#94a3b8", marginTop: 5 }}
                              >
                                Accepted files: JPG, PNG or PDF.
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {submitError && (
                  <div
                    style={{
                      marginTop: 14,
                      padding: "11px 12px",
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.15)",
                      borderRadius: 8,
                      color: "#dc2626",
                      fontSize: 11,
                    }}
                  >
                    {submitError}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleSubmitInvitation}
                  disabled={submitting}
                  style={{
                    width: "100%",
                    marginTop: 16,
                    padding: "13px 16px",
                    border: "none",
                    borderRadius: 10,
                    background: "linear-gradient(90deg, #013F99, #4CB1E9)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? "Submitting..." : "Submit Invitation"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
// -----------------------------------------------------
// SHARED STYLES
// -----------------------------------------------------
const labelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "#64748b",
  marginBottom: 5,
};
const inputStyle = {
  width: "100%",
  padding: "11px 12px",
  border: "1px solid rgba(1,63,153,0.15)",
  borderRadius: 8,
  fontSize: 13,
  boxSizing: "border-box",
  outline: "none",
  background: "#fff",
};
const toggleStyle = (active) => ({
  flex: 1,
  padding: "10px 12px",
  borderRadius: 8,
  border: active ? "1px solid #013F99" : "1px solid rgba(1,63,153,0.15)",
  background: active ? "#013F99" : "#fff",
  color: active ? "#fff" : "#64748b",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
});
