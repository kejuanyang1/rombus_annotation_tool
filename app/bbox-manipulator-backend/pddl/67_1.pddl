(define (problem 67_1-goal)
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
    (in office_01 container_01)
    (in office_06 container_01)
    (in office_07 container_02)
    (in office_08 container_02)
    (in tool_08 container_01)
    (in office_04 container_01)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
