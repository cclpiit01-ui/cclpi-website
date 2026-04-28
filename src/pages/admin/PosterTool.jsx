import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, Type, ListChecks, GraduationCap, Image as ImageIcon } from 'lucide-react';
import JobPoster from '@/components/ui/JobPoster';

const PosterTool = () => {
  const posterRef = useRef(null);
  const [staffPhoto, setStaffPhoto] = useState(null);

  const [formData, setFormData] = useState({
    position: 'BILLING & COLLECTION ASSOCIATES',
    area: 'CAGAYAN DE ORO CITY',
    description: 'Responsible for billing processing, collection monitoring, and assisting clients with account concerns.',
    brief: 'Cosmopolitan CLIMBS Life Plan Inc (CCLPI Plans) is looking for someone to process and send Statements of Account (SOAs).',
    education: 'Graduate of a 4-year course.\nFinance or Business Administration.',
    competencies: 'Basic PC knowledge\nProficiency in MS Office\nAttention to detail',
  });

  const downloadPoster = async () => {
    if (!posterRef.current) return;
    try {
      const dataUrl = await toPng(posterRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        width: 650,
        height: 840,
        style: {
          transform: 'none',
          transformOrigin: 'unset',
          margin: '0',
          padding: '0',
        },
      });
      const link = document.createElement('a');
      link.download = `CCLPI-${formData.position}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
      alert("Error sa pag-download.");
    }
  };

  const Field = ({ label, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </label>
      {children}
    </div>
  );

  const inputStyle = {
    width: '100%',
    background: '#f2f2f7',
    border: '0.5px solid rgba(0,0,0,0.08)',
    borderRadius: 10,
    padding: '10px 13px',
    fontSize: 13,
    color: '#1c1c1e',
    outline: 'none',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  };

  const textareaStyle = {
    ...inputStyle,
    resize: 'none',
    lineHeight: 1.6,
  };

  const SectionLabel = ({ icon: Icon, text }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
      {Icon && <Icon size={12} color="#8e8e93" />}
      <span style={{ fontSize: 11, fontWeight: 600, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {text}
      </span>
    </div>
  );

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: '#f2f2f7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      overflow: 'hidden',
    }}>

      {/* LEFT PANEL */}
      <div style={{
        width: 340,
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        borderRight: '0.5px solid rgba(0,0,0,0.08)',
        flexShrink: 0,
      }}>

        {/* PANEL HEADER */}
        <div style={{ padding: '22px 22px 18px', borderBottom: '0.5px solid #f2f2f7' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1c1c1e', margin: 0, letterSpacing: -0.4 }}>
            Poster Editor
          </h2>
          <p style={{ fontSize: 12, color: '#8e8e93', margin: '2px 0 0' }}>
            CCLPI Recruitment Tool
          </p>
        </div>

        {/* SCROLLABLE FIELDS */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* SECTION: Header */}
          <div style={{ background: '#f9f9fb', borderRadius: 14, padding: '16px 14px', border: '0.5px solid rgba(0,0,0,0.06)' }}>
            <SectionLabel text="Header Details" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label="Job Position">
                <input
                  style={inputStyle}
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value.toUpperCase() })}
                />
              </Field>
              <Field label="Area / Location">
                <input
                  style={inputStyle}
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value.toUpperCase() })}
                />
              </Field>
            </div>
          </div>

          {/* SECTION: Content */}
          <div style={{ background: '#f9f9fb', borderRadius: 14, padding: '16px 14px', border: '0.5px solid rgba(0,0,0,0.06)' }}>
            <SectionLabel icon={Type} text="Job Content" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label="Job Description">
                <textarea
                  style={{ ...textareaStyle, height: 80 }}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter job responsibilities..."
                />
              </Field>
              <Field label="Job Brief / Intro">
                <textarea
                  style={{ ...textareaStyle, height: 88 }}
                  value={formData.brief}
                  onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                />
              </Field>
            </div>
          </div>

          {/* SECTION: Requirements */}
          <div style={{ background: '#f9f9fb', borderRadius: 14, padding: '16px 14px', border: '0.5px solid rgba(0,0,0,0.06)' }}>
            <SectionLabel icon={ListChecks} text="Requirements" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label="Competencies (1 per line)">
                <textarea
                  style={{ ...textareaStyle, height: 96 }}
                  value={formData.competencies}
                  onChange={(e) => setFormData({ ...formData, competencies: e.target.value })}
                />
              </Field>
              <Field label="Educational Requirement">
                <textarea
                  style={{ ...textareaStyle, height: 72 }}
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                />
              </Field>
            </div>
          </div>

          {/* PHOTO UPLOAD */}
          <div>
            <input
              type="file"
              id="p-upload"
              style={{ display: 'none' }}
              onChange={(e) => setStaffPhoto(URL.createObjectURL(e.target.files[0]))}
            />
            <label
              htmlFor="p-upload"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '12px', borderRadius: 12,
                border: '1.5px dashed rgba(0,0,0,0.12)',
                cursor: 'pointer', fontSize: 13, fontWeight: 500,
                color: staffPhoto ? '#0b3d91' : '#8e8e93',
                background: staffPhoto ? '#eef2ff' : 'transparent',
                transition: 'all 0.15s',
              }}
            >
              <ImageIcon size={15} />
              {staffPhoto ? 'Photo uploaded — tap to change' : 'Upload Staff Photo'}
            </label>
          </div>
        </div>

        {/* DOWNLOAD BUTTON */}
        <div style={{ padding: '14px 18px', borderTop: '0.5px solid #f2f2f7' }}>
          <button
            onClick={downloadPoster}
            style={{
              width: '100%', background: '#0b3d91', color: '#fff',
              border: 'none', borderRadius: 13, padding: '13px',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              letterSpacing: -0.2, transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#0a3480'}
            onMouseLeave={e => e.currentTarget.style.background = '#0b3d91'}
          >
            <Download size={16} /> Download Poster
          </button>
        </div>
      </div>

      {/* RIGHT SIDE — LIVE PREVIEW */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        overflow: 'auto',
        background: '#f2f2f7',
      }}>
        {/* PREVIEW LABEL */}
        <div style={{
          marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{
            background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)',
            borderRadius: 20, padding: '4px 14px',
            fontSize: 11, fontWeight: 600, color: '#8e8e93',
            textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            Live Preview
          </span>
        </div>

        {/* POSTER PREVIEW */}
        <div style={{
          transform: 'scale(0.75)',
          transformOrigin: 'top center',
          display: 'inline-block',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
        }}>
          <JobPoster ref={posterRef} data={formData} staffPhoto={staffPhoto} />
        </div>
      </div>
    </div>
  );
};

export default PosterTool;