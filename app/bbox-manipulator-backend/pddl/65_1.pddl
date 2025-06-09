(define (problem 65_1-goal)
  (:domain gripper-strips)
  (:objects
    office_02 - item
    office_04 - item
    office_09 - item
    tool_02 - item
    tool_06 - item
    tool_09 - item
    container_03 - container
  )
  (:init
    (in office_02 container_03)
    (in office_04 container_03)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
