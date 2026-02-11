import { useState } from 'react';
import {
  INDUSTRIES,
  TAM_OPTIONS,
  SLIDER_OPTIONS,
  RISK_OPTIONS,
  OPPORTUNITY_OPTIONS,
} from '../data/industries';

/**
 * Slider component for selecting from predefined options
 */
function SliderInput({ label, name, options, value, onChange }) {
  const currentIndex = options.findIndex(opt => opt.value === value);
  
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      <div className="slider-container">
        <input
          type="range"
          min="0"
          max={options.length - 1}
          value={currentIndex >= 0 ? currentIndex : Math.floor(options.length / 2)}
          onChange={(e) => onChange(name, options[parseInt(e.target.value)].value)}
          className="slider-input"
        />
        <div className="slider-labels">
          {options.map((opt, i) => (
            <span
              key={opt.value}
              className={`slider-label ${value === opt.value ? 'active' : ''}`}
            >
              {opt.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Checkbox group for multi-select options
 */
function CheckboxGroup({ label, name, options, values, onChange }) {
  const handleToggle = (optionValue) => {
    const newValues = values.includes(optionValue)
      ? values.filter(v => v !== optionValue)
      : [...values, optionValue];
    onChange(name, newValues);
  };

  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      <div className="checkbox-group">
        {options.map(opt => (
          <label key={opt.value} className="checkbox-item">
            <input
              type="checkbox"
              checked={values.includes(opt.value)}
              onChange={() => handleToggle(opt.value)}
            />
            <span className="checkbox-label">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

/**
 * Main form component for inputting startup idea data
 */
export default function IdeaForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    startupName: '',
    industry: 'Tech',
    tam: '$10M-100M',
    marketGrowth: 'Moderate',
    competition: 'Moderate',
    barriers: 'Moderate',
    feasibility: 'Moderate',
    capital: 'Moderate',
    timeToMarket: '6-12 months',
    revenueClarity: 'Somewhat clear',
    risks: [],
    opportunities: [],
  });

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="idea-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h2 className="section-title">Basic Information</h2>
        
        <div className="form-field">
          <label className="form-label" htmlFor="startupName">Startup Name</label>
          <input
            type="text"
            id="startupName"
            name="startupName"
            value={formData.startupName}
            onChange={handleInputChange}
            placeholder="Enter your startup name"
            className="text-input"
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="industry">Industry</label>
          <select
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
            className="select-input"
          >
            {INDUSTRIES.map(ind => (
              <option key={ind.value} value={ind.value}>{ind.label}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="tam">Total Addressable Market (TAM)</label>
          <select
            id="tam"
            name="tam"
            value={formData.tam}
            onChange={handleInputChange}
            className="select-input"
          >
            {TAM_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-section">
        <h2 className="section-title">Market Assessment</h2>
        
        <SliderInput
          label="Market Growth Rate"
          name="marketGrowth"
          options={SLIDER_OPTIONS.marketGrowth}
          value={formData.marketGrowth}
          onChange={handleChange}
        />

        <SliderInput
          label="Competition Level"
          name="competition"
          options={SLIDER_OPTIONS.competition}
          value={formData.competition}
          onChange={handleChange}
        />

        <SliderInput
          label="Barriers to Entry"
          name="barriers"
          options={SLIDER_OPTIONS.barriers}
          value={formData.barriers}
          onChange={handleChange}
        />
      </div>

      <div className="form-section">
        <h2 className="section-title">Execution Assessment</h2>
        
        <SliderInput
          label="Technical Feasibility"
          name="feasibility"
          options={SLIDER_OPTIONS.feasibility}
          value={formData.feasibility}
          onChange={handleChange}
        />

        <SliderInput
          label="Capital Requirements"
          name="capital"
          options={SLIDER_OPTIONS.capital}
          value={formData.capital}
          onChange={handleChange}
        />

        <SliderInput
          label="Time to Market"
          name="timeToMarket"
          options={SLIDER_OPTIONS.timeToMarket}
          value={formData.timeToMarket}
          onChange={handleChange}
        />

        <SliderInput
          label="Revenue Model Clarity"
          name="revenueClarity"
          options={SLIDER_OPTIONS.revenueClarity}
          value={formData.revenueClarity}
          onChange={handleChange}
        />
      </div>

      <div className="form-section">
        <h2 className="section-title">Risks & Opportunities</h2>
        
        <CheckboxGroup
          label="Identified Risks (select all that apply)"
          name="risks"
          options={RISK_OPTIONS}
          values={formData.risks}
          onChange={handleChange}
        />

        <CheckboxGroup
          label="Strategic Opportunities (select all that apply)"
          name="opportunities"
          options={OPPORTUNITY_OPTIONS}
          values={formData.opportunities}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          Run Stress Test
        </button>
      </div>
    </form>
  );
}
