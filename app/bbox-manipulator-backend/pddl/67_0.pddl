(define (problem 67_0-goal)
  (:domain gripper-strips)
  (:objects
    office_01 - item
    office_04 - item
    office_06 - item
    office_07 - item
    office_08 - item
    tool_08 - item
    container_01 - container
    container_02 - container
  )
  (:init
    (in office_08 container_01)
    (in office_07 container_02)
    (in office_06 container_02)
    (in office_04 container_02)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
