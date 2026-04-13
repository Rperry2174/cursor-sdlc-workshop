import { getAsset } from '../assets.js'
import {
  getAnalogyTimelineTestingArrow,
  getAnalogyTimelineRowFrame,
  getAnalogyTimelineStepFrame,
  LAYOUT,
  PAGE,
  getSectionBadgeWidth,
  getSdlcPhaseFrame,
  getTileGridFrames,
  getWorkflowEvolutionColumnFrame,
  getWorkflowCompareStepFrame,
  stageRectStyle,
  stageTextStyle,
  toStageFontSize,
  toStagePixels,
} from '../layout.js'
import { toneColor } from '../theme.js'

function getSectionTone(sectionTone) {
  if (sectionTone === 'section1') return 'plan'
  if (sectionTone === 'section2') return 'test'
  if (sectionTone === 'section3') return 'design'
  if (sectionTone === 'prework') return 'monitor'
  if (sectionTone === 'plan') return 'plan'
  if (sectionTone === 'design') return 'design'
  if (sectionTone === 'develop') return 'develop'
  if (sectionTone === 'test') return 'test'
  if (sectionTone === 'review') return 'review'
  if (sectionTone === 'deploy') return 'deploy'
  if (sectionTone === 'monitor') return 'monitor'
  return 'develop'
}

function getToneFromEmphasis(tone) {
  if (tone === 'orange') return 'test'
  if (tone === 'purple') return 'design'
  if (tone === 'green') return 'plan'
  return 'develop'
}

function getTileAccent(tileTone) {
  return toneColor(getSectionTone(tileTone))
}

function getMediaSrc(assetKey) {
  return getAsset(assetKey)?.browserSrc ?? ''
}

function getWorkflowTone(tone) {
  return tone === 'content' ? 'develop' : tone
}

function PptSafeCanvas({ children }) {
  return <div className="ppt-safe-canvas">{children}</div>
}

function StageText({
  rect,
  fontSize,
  children,
  color = 'var(--text-primary)',
  bold = false,
  align = 'left',
  lineHeight = 1.3,
  style,
}) {
  return (
    <div
      style={stageTextStyle(rect, fontSize, {
        color,
        bold,
        align,
        lineHeight,
        style,
      })}
    >
      {children}
    </div>
  )
}

function StageCard({
  rect,
  children,
  background = 'var(--card-bg)',
  borderColor = 'var(--border-subtle)',
  borderWidth = 1,
  borderStyle = 'solid',
  radius = 12,
  boxShadow = 'none',
  opacity = 1,
  style,
}) {
  return (
    <div
      style={{
        ...stageRectStyle(rect),
        borderRadius: `${radius}px`,
        border: `${borderWidth}px ${borderStyle} ${borderColor}`,
        background,
        boxShadow,
        overflow: 'hidden',
        opacity,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function StageLine({ rect, color, opacity = 1, style }) {
  return (
    <div
      style={{
        ...stageRectStyle(rect),
        background: color,
        borderRadius: '999px',
        opacity,
        ...style,
      }}
    />
  )
}

function StageSectionHeader({ slide }) {
  if (!slide.section) return null

  const accent = toneColor(getSectionTone(slide.section.tone))
  const badgeWidth = getSectionBadgeWidth(slide.section.tone)
  const badgeRect = {
    x: LAYOUT.sectionHeader.x,
    y: LAYOUT.sectionHeader.y,
    w: badgeWidth,
    h: LAYOUT.sectionHeader.h,
  }
  const textRect = {
    x: LAYOUT.sectionHeader.x + LAYOUT.sectionHeader.badgeTextInsetX,
    y: LAYOUT.sectionHeader.badgeTextY,
    w: badgeWidth - LAYOUT.sectionHeader.badgeTextInsetX * 2,
    h: LAYOUT.sectionHeader.badgeTextH,
  }

  return (
    <>
      <div
        style={{
          ...stageRectStyle(badgeRect),
          borderRadius: '999px',
          background:
            slide.section.tone === 'prework' ? 'rgba(147, 161, 161, 0.18)' : accent,
        }}
      />
      <StageText
        rect={textRect}
        fontSize={8}
        bold
        align="center"
        color={slide.section.tone === 'prework' ? 'var(--text-primary)' : '#ffffff'}
        style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
      >
        {slide.section.badge}
      </StageText>
      {slide.phaseBadge ? (
        <StageText
          rect={{
            x: LAYOUT.sectionHeader.x + badgeWidth + 0.18,
            y: LAYOUT.sectionHeader.phaseBadgeY,
            w: LAYOUT.sectionHeader.phaseBadgeW,
            h: LAYOUT.sectionHeader.phaseBadgeH,
          }}
          fontSize={8}
          color="var(--text-secondary)"
        >
          {slide.phaseBadge}
        </StageText>
      ) : null}
    </>
  )
}

function StagePhaseHeader({ slide }) {
  if (!slide.phase) return null

  const accent = toneColor(slide.phase.tone)
  const titleY = LAYOUT.phaseHeader.titleY

  return (
    <>
      <div
        style={{
          ...stageRectStyle({
            x: LAYOUT.phaseHeader.circle.x,
            y: titleY - 0.06,
            w: LAYOUT.phaseHeader.circle.size,
            h: LAYOUT.phaseHeader.circle.size,
          }),
          borderRadius: '50%',
          background: accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: `${toStageFontSize(9)}px`,
          fontWeight: 700,
        }}
      >
        {slide.phase.number}
      </div>
      <StageText
        rect={{
          x: PAGE.x + LAYOUT.phaseHeader.titleOffsetX,
          y: titleY,
          w: PAGE.w - LAYOUT.phaseHeader.titleOffsetX,
          h: 0.28,
        }}
        fontSize={20}
        bold
        color="var(--text-primary)"
      >
        {slide.title}
      </StageText>
      {slide.subtitle ? (
        <StageText
          rect={{
            x: PAGE.x + LAYOUT.phaseHeader.titleOffsetX,
            y: titleY + LAYOUT.phaseHeader.subtitleOffsetY,
            w: PAGE.w - LAYOUT.phaseHeader.titleOffsetX,
            h: 0.2,
          }}
          fontSize={10.5}
          color="var(--text-secondary)"
        >
          {slide.subtitle}
        </StageText>
      ) : null}
    </>
  )
}

function StageToolPills({
  items,
  tone,
  justifyContent = 'center',
  fontSize = 7,
  gap = 6,
  style,
}) {
  if (!items?.length) return null

  const accent = toneColor(tone)

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: `${gap}px`,
        justifyContent,
        alignContent: 'flex-start',
        ...style,
      }}
    >
      {items.map((item) => (
        <span
          key={item}
          style={{
            padding: '4px 8px',
            borderRadius: '999px',
            border: `1px solid ${accent}55`,
            background: `${accent}16`,
            color: accent,
            fontSize: `${toStageFontSize(fontSize)}px`,
            fontWeight: 700,
            lineHeight: 1.15,
            whiteSpace: 'nowrap',
          }}
        >
          {item}
        </span>
      ))}
    </div>
  )
}

function StageEmphasisBox({ emphasis, y, h }) {
  if (!emphasis) return null

  const accent = toneColor(getToneFromEmphasis(emphasis.tone))
  const rect = { x: PAGE.x, y, w: PAGE.w, h }

  return (
    <StageCard
      rect={rect}
      background={`${accent}16`}
      borderColor={`${accent}66`}
      radius={10}
    >
      <div
        style={{
          padding: `${toStagePixels(0.14)}px ${toStagePixels(0.22)}px`,
          fontSize: `${toStageFontSize(10.2)}px`,
          lineHeight: 1.4,
          color: 'var(--text-primary)',
        }}
      >
        {emphasis.label ? <strong>{emphasis.label} </strong> : null}
        {emphasis.body}
      </div>
    </StageCard>
  )
}

function StageHeroCallout({ hero, y, tone }) {
  if (!hero) return null

  const accent = toneColor(tone)
  const rect = {
    x: LAYOUT.heroCallout.x,
    y,
    w: LAYOUT.heroCallout.w,
    h: LAYOUT.heroCallout.h,
  }

  return (
    <StageCard rect={rect} background={`${accent}16`} borderColor={`${accent}66`} radius={12}>
      <div
        style={{
          padding: `${toStagePixels(0.16)}px ${toStagePixels(0.24)}px`,
          fontSize: `${toStageFontSize(14)}px`,
          textAlign: 'center',
          color: 'var(--text-primary)',
          lineHeight: 1.35,
        }}
      >
        {hero.lead}
        <span style={{ color: accent, fontWeight: 700 }}>{hero.highlight}</span>
        {hero.tail}
      </div>
    </StageCard>
  )
}

function renderPptSafeTitleHero(slide) {
  return (
    <PptSafeCanvas>
      <div
        style={{
          ...stageRectStyle(LAYOUT.titleHero.badge),
          borderRadius: '999px',
          background: '#667EEA',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: `${toStageFontSize(8)}px`,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
      >
        {slide.badge}
      </div>

      <div
        style={{
          ...stageRectStyle(LAYOUT.titleHero.title),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '18px',
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            color: '#00B894',
            fontSize: `${toStageFontSize(30)}px`,
            fontWeight: 800,
            lineHeight: 1.1,
          }}
        >
          {slide.titleParts[0]}
        </span>
        <span
          style={{
            color: 'var(--text-secondary)',
            fontSize: `${toStageFontSize(22)}px`,
            fontWeight: 400,
            lineHeight: 1.1,
          }}
        >
          {slide.titleParts[1]}
        </span>
        <span
          style={{
            color: '#764BA2',
            fontSize: `${toStageFontSize(30)}px`,
            fontWeight: 800,
            lineHeight: 1.1,
          }}
        >
          {slide.titleParts[2]}
        </span>
      </div>

      <StageText
        rect={LAYOUT.titleHero.tagline}
        fontSize={13}
        align="center"
        color="var(--text-secondary)"
      >
        {slide.tagline}
      </StageText>

      {slide.pills.map((pill, index) => (
        <StageCard
          key={pill.text}
          rect={{
            x: 2.2 + index * (LAYOUT.titleHero.pillW + LAYOUT.titleHero.pillGap),
            y: LAYOUT.titleHero.pillY,
            w: LAYOUT.titleHero.pillW,
            h: LAYOUT.titleHero.pillH,
          }}
          background="#ffffff"
          borderColor="rgba(101, 123, 131, 0.22)"
          radius={999}
          boxShadow="0 3px 10px rgba(101, 123, 131, 0.06)"
        >
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: 'var(--text-primary)',
              fontSize: `${toStageFontSize(9)}px`,
              fontWeight: 600,
            }}
          >
            <span style={{ fontSize: `${toStageFontSize(10)}px` }}>{pill.icon}</span>
            <span>{pill.text}</span>
          </div>
        </StageCard>
      ))}
    </PptSafeCanvas>
  )
}

function renderPptSafeTakeaway(slide) {
  const sectionTone = slide.section?.tone ?? 'section1'
  const tone = getSectionTone(sectionTone)
  const tileFrames = getTileGridFrames(slide.tiles.length, {
    y: LAYOUT.takeaway.tiles.y,
    h: slide.discovery ? LAYOUT.takeaway.tiles.hWithDiscovery : LAYOUT.takeaway.tiles.h,
  })

  return (
    <PptSafeCanvas>
      <StageSectionHeader slide={slide} />
      <StageText
        rect={LAYOUT.takeaway.title}
        fontSize={22}
        bold
      >
        {slide.title}
      </StageText>
      <StageHeroCallout hero={slide.hero} y={LAYOUT.takeaway.heroY} tone={tone} />

      {slide.tiles.map((tile, index) => {
        const rect = tileFrames[index]
        const accent = getTileAccent(tile.tone)
        const hasMedia = Boolean(tile.media?.asset)

        return (
          <StageCard
            key={tile.label}
            rect={rect}
            background="var(--card-bg)"
            borderColor="rgba(101, 123, 131, 0.2)"
            radius={12}
          >
            <div
              style={{
                padding: hasMedia ? '12px 14px' : '16px 18px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: hasMedia ? '6px' : '8px',
              }}
            >
              <div
                style={{
                  fontSize: `${toStageFontSize(8.5)}px`,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: accent,
                }}
              >
                {tile.label}
              </div>
              {hasMedia ? (
                <div
                  style={{
                    height: `${toStagePixels(0.72)}px`,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1px solid rgba(101, 123, 131, 0.22)',
                    background: 'rgba(255, 255, 255, 0.72)',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={getMediaSrc(tile.media.asset)}
                    alt={getAsset(tile.media.asset)?.alt ?? tile.title ?? tile.label}
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'block',
                      objectFit: tile.media.fit === 'cover' ? 'cover' : 'contain',
                      objectPosition: 'center',
                    }}
                  />
                </div>
              ) : null}
              <div
                style={{
                  fontSize: `${toStageFontSize(hasMedia ? 11.2 : 12.5)}px`,
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: 'var(--text-primary)',
                }}
              >
                {tile.titleHighlight ? (
                  <span style={{ color: accent }}>{tile.titleHighlight}</span>
                ) : (
                  tile.title
                )}
              </div>
              {tile.description ? (
                <div
                  style={{
                    fontSize: `${toStageFontSize(hasMedia ? 8.2 : 9.4)}px`,
                    lineHeight: 1.45,
                    color: 'var(--text-secondary)',
                    marginBottom: tile.bullets?.length ? (hasMedia ? '0px' : '2px') : 0,
                  }}
                >
                  {tile.description}
                </div>
              ) : null}
              {tile.bullets?.length ? (
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: hasMedia ? '4px' : '6px',
                    fontSize: `${toStageFontSize(hasMedia ? 8.0 : 9.1)}px`,
                    lineHeight: 1.4,
                    color: 'var(--text-secondary)',
                  }}
                >
                  {tile.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </StageCard>
        )
      })}

      {slide.discovery ? (
        <StageCard
          rect={LAYOUT.takeaway.discovery.frame}
          background="var(--card-bg)"
          borderColor="rgba(101, 123, 131, 0.22)"
          radius={12}
        >
          <StageText
            rect={LAYOUT.takeaway.discovery.label}
            fontSize={8.8}
            bold
          >
            {slide.discovery.label}
          </StageText>
          {slide.discovery.groups.map((group, index) => {
            const groupWidth =
              (PAGE.w -
                LAYOUT.takeaway.discovery.padX * 2 -
                LAYOUT.takeaway.discovery.gap * (slide.discovery.groups.length - 1)) /
              slide.discovery.groups.length
            const groupX =
              PAGE.x +
              LAYOUT.takeaway.discovery.padX +
              index * (groupWidth + LAYOUT.takeaway.discovery.gap)

            return (
              <div key={group.label}>
                <StageText
                  rect={{
                    x: groupX,
                    y: LAYOUT.takeaway.discovery.groupsY,
                    w: groupWidth,
                    h: 0.14,
                  }}
                  fontSize={7}
                  bold
                  color="var(--text-secondary)"
                >
                  {group.label}
                </StageText>
                <div
                  style={{
                    ...stageRectStyle({
                      x: groupX,
                      y: LAYOUT.takeaway.discovery.pillsY,
                      w: groupWidth,
                      h: 0.44,
                    }),
                  }}
                >
                  <StageToolPills
                    items={group.items}
                    tone={tone}
                    justifyContent="flex-start"
                    fontSize={7}
                  />
                </div>
              </div>
            )
          })}
        </StageCard>
      ) : null}

      <StageEmphasisBox
        emphasis={slide.emphasis}
        y={slide.discovery ? LAYOUT.takeaway.emphasis.yWithDiscovery : LAYOUT.takeaway.emphasis.y}
        h={slide.discovery ? LAYOUT.takeaway.emphasis.hWithDiscovery : LAYOUT.takeaway.emphasis.h}
      />
    </PptSafeCanvas>
  )
}

function renderPptSafeSdlcOverview(slide) {
  const highlight = slide.highlight
  const footer = slide.footerCallout
    ? slide.footerCallout
    : slide.footerText
      ? `${slide.footerText} ${slide.highlight}`
      : null

  return (
    <PptSafeCanvas>
      <StageText
        rect={LAYOUT.sdlc.title}
        fontSize={22}
        bold
        align="center"
      >
        {slide.title}
      </StageText>

      {slide.sdlcPhases.map((phase, index) => {
        const isActive = highlight === phase.name
        const dimmed = Boolean(highlight && highlight !== phase.name && highlight !== 'Monitor')
        const rect = getSdlcPhaseFrame(index)
        const accent = toneColor(phase.tone)

        return (
          <div key={phase.name}>
            <StageCard
              rect={rect}
              background="var(--card-bg)"
              borderColor={isActive ? accent : 'rgba(101, 123, 131, 0.18)'}
              borderWidth={isActive ? 2 : 1}
              boxShadow={isActive ? `0 10px 24px ${accent}22` : 'none'}
              opacity={dimmed ? 0.38 : 1}
            >
              <div
                style={{
                  padding: '12px 8px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: `${toStageFontSize(7)}px`,
                    fontWeight: 700,
                    color: isActive ? accent : 'var(--text-secondary)',
                    marginBottom: '8px',
                  }}
                >
                  {phase.num}
                </div>
                <div
                  style={{
                    fontSize: `${toStageFontSize(9.5)}px`,
                    fontWeight: 700,
                    color: isActive ? accent : 'var(--cursor-blue)',
                    marginBottom: '10px',
                  }}
                >
                  {phase.name}
                </div>
                {phase.subcategories ? (
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '9px',
                    }}
                  >
                    {phase.subcategories.map((subcategory) => (
                      <div key={subcategory.label}>
                        <div
                          style={{
                            fontSize: `${toStageFontSize(6.5)}px`,
                            fontWeight: 700,
                            color: 'var(--text-secondary)',
                            marginBottom: '5px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.7px',
                          }}
                        >
                          {subcategory.label}
                        </div>
                        <StageToolPills items={subcategory.tools} tone={phase.tone} fontSize={6.5} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <StageToolPills items={phase.tools} tone={phase.tone} fontSize={6.5} />
                )}
              </div>
            </StageCard>
            {index < slide.sdlcPhases.length - 1 ? (
              <StageText
                rect={{
                  x: rect.x + rect.w + 0.02,
                  y: LAYOUT.sdlc.arrowY,
                  w: 0.1,
                  h: 0.18,
                }}
                fontSize={14}
                align="center"
                color="var(--text-secondary)"
              >
                →
              </StageText>
            ) : null}
          </div>
        )
      })}

      <StageCard
        rect={LAYOUT.sdlc.monitor}
        background="var(--card-bg)"
        borderColor={
          highlight === 'Monitor'
            ? toneColor('monitor')
            : 'rgba(101, 123, 131, 0.22)'
        }
        borderStyle={highlight === 'Monitor' ? 'solid' : 'dashed'}
        borderWidth={highlight === 'Monitor' ? 2 : 1}
        opacity={highlight ? (highlight === 'Monitor' ? 1 : 0.5) : 0.75}
      >
        <div
          style={{
            padding: '12px 10px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: `${toStageFontSize(7)}px`,
              fontWeight: 700,
              color:
                highlight === 'Monitor'
                  ? toneColor('monitor')
                  : 'var(--text-secondary)',
              marginBottom: '8px',
            }}
          >
            {slide.monitorPhase.num}
          </div>
          <div
            style={{
              fontSize: `${toStageFontSize(9.5)}px`,
              fontWeight: 700,
              color:
                highlight === 'Monitor'
                  ? toneColor('monitor')
                  : 'var(--cursor-blue)',
              marginBottom: '10px',
            }}
          >
            {slide.monitorPhase.name}
          </div>
          <StageToolPills items={slide.monitorPhase.tools} tone="monitor" fontSize={6.5} />
        </div>
      </StageCard>

      {footer ? (
        <StageText
          rect={LAYOUT.sdlc.footer}
          fontSize={9}
          align="center"
          color="var(--text-secondary)"
        >
          {footer}
        </StageText>
      ) : null}
    </PptSafeCanvas>
  )
}

function renderPptSafePhaseDeepDive(slide) {
  const accent = toneColor(slide.phase.tone)
  const emphasisTone =
    slide.phase.tone === 'design'
      ? 'purple'
      : slide.phase.tone === 'test'
        ? 'orange'
        : 'green'

  return (
    <PptSafeCanvas>
      <StagePhaseHeader slide={slide} />

      {slide.headerPill ? (
        <StageCard
          rect={LAYOUT.phaseDeepDive.headerPill}
          background={`${accent}18`}
          borderColor={`${accent}66`}
          radius={999}
        >
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: accent,
              fontSize: `${toStageFontSize(8.8)}px`,
              fontWeight: 700,
            }}
          >
            <span>{slide.headerPill.icon}</span>
            <span>{slide.headerPill.text}</span>
          </div>
        </StageCard>
      ) : null}

      <StageText
        rect={LAYOUT.phaseDeepDive.discoveryTitle}
        fontSize={13}
        bold
        color={accent}
      >
        Discovery Questions
      </StageText>
      {slide.discoveryQuestions.map((question, index) => {
        const rect = {
          x: LAYOUT.phaseDeepDive.discovery.x,
          y:
            LAYOUT.phaseDeepDive.discovery.y +
            index * LAYOUT.phaseDeepDive.discovery.gap,
          w: LAYOUT.phaseDeepDive.discovery.w,
          h: LAYOUT.phaseDeepDive.discovery.h,
        }

        return (
          <StageCard
            key={question}
            rect={rect}
            background="var(--card-bg)"
            borderColor={`${accent}55`}
            radius={10}
          >
            <div
              style={{
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: accent,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: `${toStageFontSize(8.8)}px`,
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                {index + 1}
              </div>
              <div
                style={{
                  fontSize: `${toStageFontSize(10.2)}px`,
                  lineHeight: 1.42,
                  color: 'var(--text-primary)',
                }}
              >
                {question}
              </div>
            </div>
          </StageCard>
        )
      })}

      <StageText
        rect={LAYOUT.phaseDeepDive.connectorArrow}
        fontSize={24}
        bold
        align="center"
        color={accent}
      >
        →
      </StageText>
      <StageText
        rect={LAYOUT.phaseDeepDive.connectorLabel}
        fontSize={8.4}
        bold
        align="center"
        color={accent}
        style={{ textTransform: 'uppercase', letterSpacing: '0.8px' }}
      >
        {slide.connectorLabel ?? ''}
      </StageText>

      <StageText
        rect={LAYOUT.phaseDeepDive.painTitle}
        fontSize={13}
        bold
        color={accent}
      >
        Common Pain Points
      </StageText>
      {slide.painPoints.map((pain, index) => {
        const rect = {
          x: LAYOUT.phaseDeepDive.pain.x,
          y: LAYOUT.phaseDeepDive.pain.y + index * LAYOUT.phaseDeepDive.pain.gap,
          w: LAYOUT.phaseDeepDive.pain.w,
          h: LAYOUT.phaseDeepDive.pain.h,
        }

        return (
          <StageCard
            key={pain.label}
            rect={rect}
            background={`${accent}14`}
            borderColor={`${accent}55`}
            radius={10}
          >
            <div
              style={{
                padding: '13px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <div
                style={{
                  fontSize: `${toStageFontSize(15)}px`,
                  flexShrink: 0,
                  marginTop: '1px',
                }}
              >
                {pain.icon}
              </div>
              <div
                style={{
                  fontSize: `${toStageFontSize(10.1)}px`,
                  lineHeight: 1.4,
                  color: 'var(--text-primary)',
                }}
              >
                <strong style={{ color: accent }}>{pain.label}</strong>
                {' - '}
                {pain.description}
              </div>
            </div>
          </StageCard>
        )
      })}

      {slide.footerCallout ? (
        <StageEmphasisBox
          emphasis={{
            tone: emphasisTone,
            label: 'Takeaway:',
            body: slide.footerCallout,
          }}
          y={LAYOUT.phaseDeepDive.footer.y}
          h={LAYOUT.phaseDeepDive.footer.h}
        />
      ) : null}
    </PptSafeCanvas>
  )
}

function renderPptSafeWorkflowCompare(slide) {
  return (
    <PptSafeCanvas>
      <StageText rect={LAYOUT.workflowCompare.title} fontSize={20} bold>
        {slide.title}
      </StageText>

      {slide.workflowRows.map((row, rowIndex) => {
        const rowY = LAYOUT.workflowCompare.rowY + rowIndex * LAYOUT.workflowCompare.rowGap

        return (
          <div key={row.label}>
            <div
              style={{
                ...stageRectStyle({
                  x: LAYOUT.workflowCompare.rowLabel.x,
                  y: rowY + 0.65,
                  w: LAYOUT.workflowCompare.rowLabel.w,
                  h: LAYOUT.workflowCompare.rowLabel.h,
                }),
                fontSize: `${toStageFontSize(9.2)}px`,
                fontWeight: 700,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                textAlign: 'center',
              }}
            >
              {row.label}
            </div>

            {row.steps.map((step, stepIndex) => {
              const rect = getWorkflowCompareStepFrame(rowIndex, stepIndex)
              const accent =
                row.label === 'Git' ? toneColor('develop') : 'rgba(101, 123, 131, 0.24)'

              return (
                <div key={step.title}>
                  <StageCard
                    rect={rect}
                    background="var(--card-bg)"
                    borderColor={accent}
                    radius={12}
                  >
                    <div style={{ padding: '18px 17px 14px' }}>
                      <div
                        style={{
                          fontSize: `${toStageFontSize(11.5)}px`,
                          fontWeight: 700,
                          lineHeight: 1.2,
                          color: 'var(--text-primary)',
                          marginBottom: '6px',
                        }}
                      >
                        {step.title}
                      </div>
                      <div
                        style={{
                          fontSize: `${toStageFontSize(8.8)}px`,
                          color: 'var(--text-secondary)',
                          lineHeight: 1.3,
                          marginBottom: '10px',
                        }}
                      >
                        {step.subtitle}
                      </div>
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: '14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '5px',
                          fontSize: `${toStageFontSize(8.6)}px`,
                          color: 'var(--text-primary)',
                          lineHeight: 1.35,
                        }}
                      >
                        {step.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  </StageCard>
                  {stepIndex < row.steps.length - 1 ? (
                    <StageText
                      rect={{
                        x: rect.x + LAYOUT.workflowCompare.arrowOffsetX,
                        y: rowY + LAYOUT.workflowCompare.arrowY,
                        w: 0.28,
                        h: 0.16,
                      }}
                      fontSize={14}
                      align="center"
                      color="var(--text-secondary)"
                    >
                      →
                    </StageText>
                  ) : null}
                </div>
              )
            })}
          </div>
        )
      })}

      <StageEmphasisBox
        emphasis={slide.emphasis}
        y={LAYOUT.workflowCompare.emphasis.y}
        h={LAYOUT.workflowCompare.emphasis.h}
      />
    </PptSafeCanvas>
  )
}

function renderPptSafeWorkflowColumns(slide) {
  const testAccent = toneColor('test')

  if (slide.variant === 'analogyTimeline') {
    return (
      <PptSafeCanvas>
        <StagePhaseHeader slide={slide} />

        {slide.timelineRows.map((row, rowIndex) => {
          const rowRect = getAnalogyTimelineRowFrame(rowIndex)

          return (
            <div key={row.label}>
              <StageCard
                rect={rowRect}
                background={rowIndex === 0 ? 'var(--card-bg)' : 'var(--code-bg)'}
                borderColor={
                  rowIndex === 0
                    ? 'rgba(101, 123, 131, 0.2)'
                    : `${testAccent}55`
                }
                radius={12}
              />
              <StageText
                rect={{
                  x: rowRect.x + LAYOUT.workflowColumns.analogyTimeline.label.offsetX,
                  y: rowRect.y + LAYOUT.workflowColumns.analogyTimeline.label.offsetY,
                  w: LAYOUT.workflowColumns.analogyTimeline.label.w,
                  h: LAYOUT.workflowColumns.analogyTimeline.label.h,
                }}
                fontSize={8.2}
                bold
                color={rowIndex === 0 ? 'var(--text-secondary)' : testAccent}
                style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
              >
                {row.label}
              </StageText>
              <StageText
                rect={{
                  x: rowRect.x + LAYOUT.workflowColumns.analogyTimeline.badge.offsetX,
                  y: rowRect.y + LAYOUT.workflowColumns.analogyTimeline.badge.offsetY,
                  w: LAYOUT.workflowColumns.analogyTimeline.badge.w,
                  h: LAYOUT.workflowColumns.analogyTimeline.badge.h,
                }}
                fontSize={7.6}
                color="var(--text-secondary)"
              >
                {row.badge}
              </StageText>

              {row.steps.map((step, index) => {
                const rect = getAnalogyTimelineStepFrame(index, rowIndex)
                const variantTone =
                  step.variant === 'danger'
                    ? 'deploy'
                    : step.variant === 'investment'
                      ? 'review'
                      : step.variant === 'glow'
                        ? 'test'
                        : 'develop'
                const accent = toneColor(variantTone)

                return (
                  <div key={`${row.label}-${step.label}`}>
                    <StageCard
                      rect={rect}
                      background={step.variant ? `${accent}14` : 'var(--card-bg)'}
                      borderColor={step.variant ? accent : 'rgba(101, 123, 131, 0.22)'}
                      borderWidth={step.variant ? 2 : 1}
                      radius={10}
                    >
                      <div
                        style={{
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          padding: '10px 8px',
                          fontSize: `${toStageFontSize(7.8)}px`,
                          lineHeight: 1.25,
                          color: step.variant ? accent : 'var(--text-primary)',
                          fontWeight: step.variant ? 700 : 600,
                        }}
                      >
                        {step.label}
                      </div>
                    </StageCard>
                    {index < row.steps.length - 1 ? (
                      <StageText
                        rect={{
                          x: rect.x + LAYOUT.workflowColumns.analogyTimeline.arrowOffsetX,
                          y: rowRect.y + LAYOUT.workflowColumns.analogyTimeline.arrowOffsetY,
                          w: 0.12,
                          h: 0.12,
                        }}
                        fontSize={10}
                        color="var(--text-secondary)"
                        align="center"
                      >
                        →
                      </StageText>
                    ) : null}
                  </div>
                )
              })}
            </div>
          )
        })}

        {slide.timelineRows.map((row, rowIndex) => {
          const arrow = getAnalogyTimelineTestingArrow(rowIndex, {
            sourceStepIndex: row.steps.length - 1,
          })
          const lineThickness = 0.025

          return (
            <div key={`${row.label}-testing-arrow`}>
              <StageLine
                rect={{
                  x: arrow.startX - lineThickness / 2,
                  y: arrow.elbowY,
                  w: lineThickness,
                  h: arrow.startY - arrow.elbowY,
                }}
                color={testAccent}
              />
              <StageLine
                rect={{
                  x: arrow.targetX,
                  y: arrow.elbowY - lineThickness / 2,
                  w: arrow.startX - arrow.targetX,
                  h: lineThickness,
                }}
                color={testAccent}
              />
              <StageLine
                rect={{
                  x: arrow.targetX - lineThickness / 2,
                  y: arrow.elbowY,
                  w: lineThickness,
                  h: arrow.targetY - arrow.elbowY,
                }}
                color={testAccent}
              />
              <StageText
                rect={{
                  x: arrow.targetX - 0.12,
                  y: arrow.targetY - 0.01,
                  w: 0.24,
                  h: 0.2,
                }}
                fontSize={13}
                align="center"
                color={testAccent}
                bold
              >
                ↓
              </StageText>
            </div>
          )
        })}

        {slide.insightCards.map((card, index) => {
          const x =
            index === 0 ? PAGE.x : LAYOUT.workflowColumns.analogyTimeline.insightRightX
          const cardRect = {
            x,
            y: LAYOUT.workflowColumns.analogyTimeline.insightY,
            w: LAYOUT.workflowColumns.analogyTimeline.insightW,
            h: LAYOUT.workflowColumns.analogyTimeline.insightH,
          }

          return (
            <div key={card.label}>
              <StageCard
                rect={cardRect}
                background={`${testAccent}14`}
                borderColor={`${testAccent}66`}
                radius={10}
              />
              <StageText
                rect={{
                  x: x + 0.16,
                  y: LAYOUT.workflowColumns.analogyTimeline.insightY + 0.13,
                  w: 1.65,
                  h: 0.14,
                }}
                fontSize={7.8}
                bold
                color={testAccent}
                style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
              >
                {card.label}
              </StageText>
              <StageText
                rect={{
                  x: x + 0.16,
                  y: LAYOUT.workflowColumns.analogyTimeline.insightY + 0.36,
                  w: LAYOUT.workflowColumns.analogyTimeline.insightW - 0.32,
                  h: 0.42,
                }}
                fontSize={8.6}
                color="var(--text-primary)"
                lineHeight={1.4}
              >
                {card.body}
              </StageText>
            </div>
          )
        })}
      </PptSafeCanvas>
    )
  }

  return (
    <PptSafeCanvas>
      <StagePhaseHeader slide={slide} />

      {slide.workflowColumns.map((column, index) => {
        const rect = getWorkflowEvolutionColumnFrame(index)
        const accent = toneColor(getWorkflowTone(column.tone))

        return (
          <div key={column.title}>
            <StageCard
              rect={rect}
              background="var(--card-bg)"
              borderColor={`${accent}66`}
              radius={12}
            />
            <StageText
              rect={{
                x: rect.x + LAYOUT.workflowColumns.evolution.titleInsetX,
                y: LAYOUT.workflowColumns.evolution.titleY,
                w: rect.w - LAYOUT.workflowColumns.evolution.titleInsetX * 2,
                h: LAYOUT.workflowColumns.evolution.titleH,
              }}
              fontSize={11.2}
              bold
              align="center"
              color={accent}
            >
              {column.title}
            </StageText>
            <StageText
              rect={{
                x: rect.x + LAYOUT.workflowColumns.evolution.titleInsetX,
                y: LAYOUT.workflowColumns.evolution.subtitleY,
                w: rect.w - LAYOUT.workflowColumns.evolution.titleInsetX * 2,
                h: LAYOUT.workflowColumns.evolution.subtitleH,
              }}
              fontSize={8.2}
              align="center"
              color="var(--text-secondary)"
            >
              {column.subtitle}
            </StageText>

            {column.steps.map((step, stepIndex) => {
              const y =
                LAYOUT.workflowColumns.evolution.stepY +
                stepIndex * LAYOUT.workflowColumns.evolution.stepGap
              const stepRect = {
                x: rect.x + LAYOUT.workflowColumns.evolution.stepInsetX,
                y,
                w: rect.w - LAYOUT.workflowColumns.evolution.stepInsetX * 2,
                h: LAYOUT.workflowColumns.evolution.stepH,
              }

              return (
                <div key={step}>
                  <StageCard
                    rect={stepRect}
                    background={
                      stepIndex === column.highlightStep ? `${accent}16` : '#ffffff'
                    }
                    borderColor={
                      stepIndex === column.highlightStep
                        ? accent
                        : 'rgba(101, 123, 131, 0.22)'
                    }
                    borderWidth={stepIndex === column.highlightStep ? 2 : 1}
                    radius={8}
                  />
                  <StageText
                    rect={{
                      x: stepRect.x + LAYOUT.workflowColumns.evolution.stepTextInsetX,
                      y: y + LAYOUT.workflowColumns.evolution.stepTextInsetY,
                      w:
                        stepRect.w -
                        LAYOUT.workflowColumns.evolution.stepTextInsetX * 2,
                      h: LAYOUT.workflowColumns.evolution.stepTextH,
                    }}
                    fontSize={8.6}
                    bold={stepIndex === column.highlightStep}
                    align="center"
                    color="var(--text-primary)"
                  >
                    {step}
                  </StageText>
                </div>
              )
            })}

            <StageText
              rect={{
                x: rect.x + LAYOUT.workflowColumns.evolution.footerInsetX,
                y: LAYOUT.workflowColumns.evolution.footerY,
                w: rect.w - LAYOUT.workflowColumns.evolution.footerInsetX * 2,
                h: LAYOUT.workflowColumns.evolution.footerH,
              }}
              fontSize={8.1}
              align="center"
              color="var(--text-secondary)"
              lineHeight={1.35}
            >
              {column.footer}
            </StageText>
          </div>
        )
      })}

      <StageEmphasisBox
        emphasis={{ label: '', body: slide.mainTakeaway, tone: 'green' }}
        y={LAYOUT.workflowColumns.evolution.emphasis.y}
        h={LAYOUT.workflowColumns.evolution.emphasis.h}
      />
    </PptSafeCanvas>
  )
}

function BrowserFrame({ browserMock, children }) {
  const frame = LAYOUT.browserDemo.frame
  const urlBarWidth = frame.w - LAYOUT.browserDemo.urlBar.x - LAYOUT.browserDemo.urlBar.insetRight

  return (
    <StageCard
      rect={frame}
      background="#ffffff"
      borderColor="rgba(101, 123, 131, 0.28)"
      radius={12}
      boxShadow="0 10px 28px rgba(101, 123, 131, 0.1)"
    >
      <div
        style={{
          height: `${toStagePixels(LAYOUT.browserDemo.chromeBarH)}px`,
          background: '#f0f0f0',
          borderBottom: '1px solid rgba(101, 123, 131, 0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0 12px',
        }}
      >
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#febc2e' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840' }} />
        </div>
        <div
          style={{
            width: `${toStagePixels(urlBarWidth)}px`,
            height: `${toStagePixels(LAYOUT.browserDemo.urlBar.h)}px`,
            borderRadius: '999px',
            border: '1px solid rgba(101, 123, 131, 0.18)',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            color: 'var(--text-secondary)',
            fontSize: `${toStageFontSize(7)}px`,
          }}
        >
          {browserMock.url}
        </div>
      </div>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: `calc(100% - ${toStagePixels(LAYOUT.browserDemo.chromeBarH)}px)`,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </StageCard>
  )
}

function FlappyBirdScene({ score }) {
  const pipes = [
    { left: '18%', topHeight: '28%', bottomHeight: '34%' },
    { left: '40%', topHeight: '46%', bottomHeight: '28%' },
    { left: '62%', topHeight: '22%', bottomHeight: '42%' },
  ]

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#4EC5F1' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #4EC5F1 0%, #4EC5F1 68%, #8BC34A 68%, #689F38 100%)' }} />
      {pipes.map((pipe, index) => (
        <div key={index}>
          <div
            style={{
              position: 'absolute',
              left: pipe.left,
              top: 0,
              width: '3.2%',
              height: pipe.topHeight,
              background: '#4CAF50',
              border: '2px solid #388E3C',
              borderTop: 0,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: pipe.left,
              bottom: '15%',
              width: '3.2%',
              height: pipe.bottomHeight,
              background: '#4CAF50',
              border: '2px solid #388E3C',
              borderBottom: 0,
            }}
          />
        </div>
      ))}
      <div
        style={{
          position: 'absolute',
          left: '28%',
          top: '34%',
          width: 28,
          height: 22,
          borderRadius: '50%',
          background: '#FDD835',
          border: '2px solid #F9A825',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 18,
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#ffffff',
          fontWeight: 800,
          fontSize: `${toStageFontSize(18)}px`,
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      >
        {score}
      </div>
    </div>
  )
}

function PacmanMaze({ powerUp }) {
  const wallStyle = {
    position: 'absolute',
    border: '2px solid #1A1AFF',
    borderRadius: 6,
    background: 'transparent',
  }

  return (
    <>
      <div style={{ ...wallStyle, left: '12%', top: '18%', width: '14%', height: '8%' }} />
      <div style={{ ...wallStyle, left: '30%', top: '18%', width: '12%', height: '8%' }} />
      <div style={{ ...wallStyle, left: '58%', top: '18%', width: '12%', height: '8%' }} />
      <div style={{ ...wallStyle, left: '76%', top: '18%', width: '14%', height: '8%' }} />
      <div style={{ ...wallStyle, left: '12%', top: '36%', width: '8%', height: '22%' }} />
      <div style={{ ...wallStyle, left: '26%', top: '36%', width: '20%', height: '8%' }} />
      <div style={{ ...wallStyle, left: '56%', top: '36%', width: '20%', height: '8%' }} />
      <div style={{ ...wallStyle, left: '82%', top: '36%', width: '8%', height: '22%' }} />
      <div style={{ ...wallStyle, left: '12%', top: '72%', width: '14%', height: '8%' }} />
      <div style={{ ...wallStyle, left: '44%', top: '72%', width: '18%', height: '8%' }} />
      <div style={{ ...wallStyle, left: '76%', top: '72%', width: '14%', height: '8%' }} />

      <div
        style={{
          position: 'absolute',
          left: powerUp ? '54%' : '46%',
          top: '49%',
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#FFEB3B',
          clipPath: 'polygon(100% 50%, 55% 20%, 55% 80%)',
        }}
      />

      {powerUp ? (
        <div
          style={{
            position: 'absolute',
            left: '48%',
            top: '40%',
            color: '#FFAB00',
            fontWeight: 700,
            fontSize: `${toStageFontSize(8)}px`,
            fontFamily: 'Courier New, monospace',
          }}
        >
          +20
        </div>
      ) : null}

      {[['68%', '40%'], ['76%', '58%'], ['32%', '58%']].map(([left, top], index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left,
            top,
            width: 18,
            height: 18,
            borderRadius: '10px 10px 4px 4px',
            background: powerUp ? '#2222ff' : index === 0 ? '#ff0000' : index === 1 ? '#ffb8ff' : '#00ffff',
          }}
        />
      ))}
    </>
  )
}

function PacmanScene({ browserMock }) {
  const powerUp = browserMock.variant === 'pacmanPowerUp'

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000000' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: '16px 18px 8px',
          color: '#ffffff',
          fontFamily: 'Courier New, monospace',
        }}
      >
        <div>
          <div style={{ fontSize: `${toStageFontSize(7)}px`, letterSpacing: '1px' }}>SCORE</div>
          <div
            style={{
              fontSize: `${toStageFontSize(9)}px`,
              fontWeight: 700,
              color: powerUp ? '#FFEB3B' : '#ffffff',
            }}
          >
            {browserMock.score}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          {powerUp ? (
            <>
              <div
                style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  background: '#FFAB00',
                  color: '#000000',
                  fontSize: `${toStageFontSize(8.5)}px`,
                  fontWeight: 800,
                }}
              >
                {browserMock.badge}
              </div>
              <div style={{ marginTop: '4px', color: '#FFAB00', fontSize: `${toStageFontSize(6)}px` }}>
                {browserMock.timer}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: `${toStageFontSize(7)}px`, letterSpacing: '1px' }}>HIGH SCORE</div>
              <div style={{ fontSize: `${toStageFontSize(9)}px`, fontWeight: 700 }}>
                {browserMock.highScore ?? '5000'}
              </div>
            </>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: `${toStageFontSize(7)}px`, letterSpacing: '1px' }}>LIVES</div>
          <div style={{ color: '#FFEB3B', fontSize: `${toStageFontSize(8)}px` }}>
            {'● '.repeat(browserMock.lives ?? 3).trim()}
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, top: 54, bottom: 0 }}>
        <PacmanMaze powerUp={powerUp} />
      </div>
    </div>
  )
}

function renderPptSafeBrowserDemo(slide) {
  return (
    <PptSafeCanvas>
      <StageSectionHeader slide={slide} />
      <StageText rect={LAYOUT.browserDemo.title} fontSize={22} bold>
        {slide.title}
      </StageText>
      {slide.subtitle ? (
        <StageText
          rect={LAYOUT.browserDemo.subtitle}
          fontSize={9}
          align="center"
          color="var(--text-secondary)"
        >
          {slide.subtitle}
        </StageText>
      ) : null}

      <BrowserFrame browserMock={slide.browserMock}>
        {slide.browserMock.variant === 'flappyBird' ? (
          <FlappyBirdScene score={slide.browserMock.score} />
        ) : (
          <PacmanScene browserMock={slide.browserMock} />
        )}
      </BrowserFrame>

      <StageEmphasisBox
        emphasis={slide.emphasis}
        y={LAYOUT.browserDemo.emphasis.y}
        h={LAYOUT.browserDemo.emphasis.h}
      />
    </PptSafeCanvas>
  )
}

export {
  PptSafeCanvas,
  renderPptSafeBrowserDemo,
  renderPptSafePhaseDeepDive,
  renderPptSafeSdlcOverview,
  renderPptSafeTakeaway,
  renderPptSafeTitleHero,
  renderPptSafeWorkflowCompare,
  renderPptSafeWorkflowColumns,
}
