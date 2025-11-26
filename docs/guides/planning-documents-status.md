# Planning Documents Status

This document tracks the status of planning documents in `screens/` directory and root-level `.md` files, and identifies what information should be in main documentation.

## Root Level Documents

### `ANALIZA_STANU_PROJEKTU.md`
**Status**: ⚠️ **Historical Snapshot (2025-01-03)**  
**Purpose**: Detailed project status analysis from January 2025  
**Current Relevance**: Partially outdated, but contains useful historical context

**What's Already in Documentation:**
- ✅ Project structure → `docs/architecture/frontend.md`
- ✅ Mock vs Real data status → `docs/architecture/data-evolution.md`
- ✅ Component status → `docs/components/` (being documented)
- ✅ Technology stack → `docs/architecture/overview.md`

**What's Missing from Documentation:**
- ❌ User Journey implementation status (8 journeys from LOCATIONS_BUSINESS_FLOW_PLAN.md)
- ❌ Detailed component implementation checklist
- ❌ Progress percentages and metrics

**Recommendation**: 
- **Archive** to `docs/archive/` as historical reference
- Extract useful information (user journey status) to roadmap document
- Reference in `GEMINI.md` if needed for context

---

### `CLAUDE.md`
**Status**: ❌ **Empty File**  
**Recommendation**: **Remove** - no content, not needed

---

## screens/ Directory Documents

### `LOCATIONS_BUSINESS_FLOW_PLAN.md`
**Status**: ✅ **Active Specification**  
**Purpose**: Business flow specification with 8 user journeys  
**Current Relevance**: High - serves as roadmap and specification

**Content:**
- 8 User Journeys (Onboarding, Keyword Tracking, Grid Reports, Quotas, Reviews, Competitive Intelligence, Rankings Report, Smart Tasks)
- UI requirements
- Backend touchpoints
- Subscription & quota integration
- Success metrics

**What's in Documentation:**
- ✅ Basic feature descriptions → `docs/features/`
- ✅ Component documentation → `docs/components/`
- ❌ **User Journey specifications** - NOT in documentation
- ❌ **Business flow requirements** - NOT in documentation
- ❌ **Success metrics** - NOT in documentation

**Recommendation**:
- **Keep as active specification**
- **Add to documentation**: Create `docs/features/user-journeys.md` or add to relevant feature docs
- Update implementation status as journeys are completed
- Archive when all journeys implemented

---

### `REVIEWS_API_DOCUMENTATION.md`
**Status**: ✅ **Active API Specification**  
**Purpose**: Complete API specification for Reviews system  
**Current Relevance**: High - serves as API contract specification

**Content:**
- Complete API endpoints for Reviews system
- Request/response structures
- Error handling
- Authentication
- All review-related endpoints

**What's in Documentation:**
- ✅ Basic reviews feature → `docs/features/reviews.md`
- ✅ Component documentation → `docs/components/reviews/`
- ❌ **API specification** - NOT in `docs/api/`
- ❌ **Endpoint details** - NOT in documentation

**Recommendation**:
- **Keep as active specification**
- **Add to documentation**: 
  - Create `docs/api/reviews.md` with API specification
  - Or add to `docs/api/external.md` if external API
  - Or add to `docs/api/convex.md` if Convex functions
- Mark endpoints as "Planned" vs "Implemented"
- Update when endpoints are implemented

---

### `AUTO_REPLY_FEATURE_PLAN.md`
**Status**: ✅ **Active Implementation Plan**  
**Purpose**: Detailed plan for Auto-Reply feature implementation  
**Current Relevance**: High - detailed implementation guide

**Content:**
- What's already implemented
- What needs to be added
- Component structure
- Data flow
- Backend requirements
- Step-by-step implementation guide

**What's in Documentation:**
- ✅ Basic auto-reply feature → `docs/features/reviews.md` (brief mention)
- ✅ Component documentation → `docs/components/reviews/` (being documented)
- ❌ **Detailed implementation plan** - NOT in documentation
- ❌ **Component structure details** - NOT fully documented
- ❌ **Data flow for auto-reply** - NOT in `docs/architecture/data-flow.md`

**Recommendation**:
- **Keep as active plan**
- **Add to documentation**:
  - Expand `docs/features/reviews.md` with auto-reply details
  - Document auto-reply components in `docs/components/reviews/`
  - Add auto-reply data flow to `docs/architecture/data-flow.md`
- Mark completed sections
- Archive when fully implemented

---

### `FEATURE_LIMITS_AND_TOGGLE_LOCKS.md`
**Status**: ⚠️ **Implementation Documentation (2024-11-25)**  
**Purpose**: Documents implementation of feature limits and toggle locks  
**Current Relevance**: Medium - describes implemented functionality

**Content:**
- Feature limits implementation
- Toggle lock mechanisms
- Component-specific implementations
- Limit enforcement logic

**What's in Documentation:**
- ✅ Feature limits system → `docs/features/limits.md`
- ✅ Feature system → `docs/features/system.md`
- ✅ Composables → `docs/composables/use-features.md`
- ⚠️ **Component-specific limit implementations** - Partially in component docs

**Recommendation**:
- **Archive** to `docs/archive/` or `screens/archive/`
- Information is now in main documentation
- Keep for historical reference if needed

---

### `REFACTORING_FEATURES_SYSTEM.md`
**Status**: ⚠️ **Refactoring Documentation (2024-11-25)**  
**Purpose**: Documents features system refactoring  
**Current Relevance**: Low - describes completed refactoring

**Content:**
- Refactoring steps
- Removed composables
- New unified composable
- Migration guide

**What's in Documentation:**
- ✅ Current composables → `docs/composables/use-features.md`
- ✅ Feature system → `docs/features/system.md`
- ✅ Current architecture → `docs/architecture/`

**Recommendation**:
- **Archive** to `docs/archive/`
- Refactoring is complete, information is in current documentation
- Keep for historical reference

---

### `ANALYSIS_FROM_ANTYGRAVITY_REFACTORING.md`
**Status**: ⚠️ **Analysis Documentation**  
**Purpose**: Analysis from refactoring work  
**Current Relevance**: Low - historical analysis

**Recommendation**:
- **Review content** - if contains useful insights, extract to documentation
- **Archive** if just historical analysis
- Remove if completely obsolete

---

## Summary & Action Items

### Documents to Keep Active
1. ✅ `LOCATIONS_BUSINESS_FLOW_PLAN.md` - Active specification
2. ✅ `REVIEWS_API_DOCUMENTATION.md` - Active API specification
3. ✅ `AUTO_REPLY_FEATURE_PLAN.md` - Active implementation plan

### Documents to Archive
1. ⚠️ `FEATURE_LIMITS_AND_TOGGLE_LOCKS.md` - Implemented, documented elsewhere
2. ⚠️ `REFACTORING_FEATURES_SYSTEM.md` - Completed, documented elsewhere
3. ⚠️ `ANALYSIS_FROM_ANTYGRAVITY_REFACTORING.md` - Review and archive if obsolete
4. ⚠️ `ANALIZA_STANU_PROJEKTU.md` - Historical snapshot, archive

### Documents to Remove
1. ❌ `CLAUDE.md` - Empty file

### Information to Add to Documentation

#### High Priority
1. **User Journeys** from `LOCATIONS_BUSINESS_FLOW_PLAN.md`:
   - Create `docs/features/user-journeys.md` or add to relevant feature docs
   - Document 8 user journeys with implementation status
   - Track progress as journeys are implemented

2. **Reviews API Specification** from `REVIEWS_API_DOCUMENTATION.md`:
   - Create `docs/api/reviews.md` or add to `docs/api/convex.md`
   - Document all endpoints with implementation status
   - Mark as "Planned" vs "Implemented"

3. **Auto-Reply Implementation Details** from `AUTO_REPLY_FEATURE_PLAN.md`:
   - Expand `docs/features/reviews.md` with auto-reply section
   - Document component structure and data flow
   - Add to `docs/architecture/data-flow.md`

#### Medium Priority
1. **Success Metrics** from `LOCATIONS_BUSINESS_FLOW_PLAN.md`:
   - Add to relevant feature documentation
   - Document how metrics are tracked

2. **Component Implementation Checklist**:
   - Update component documentation with implementation status
   - Track missing components from plans

## Next Steps

1. **Immediate**: Remove `CLAUDE.md` (empty file)
2. **Short-term**: Archive completed implementation docs
3. **Short-term**: Add user journeys to documentation
4. **Short-term**: Add Reviews API specification to documentation
5. **Medium-term**: Expand auto-reply documentation
6. **Ongoing**: Update planning documents as features are implemented

