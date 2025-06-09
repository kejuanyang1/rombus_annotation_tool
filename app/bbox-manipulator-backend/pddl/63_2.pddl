(define (problem 63_2-goal)
  (:domain gripper-strips)
  (:objects
    office_02 - item
    office_04 - item
    tool_01 - item
    tool_03 - item
    container_03 - container
    container_04 - container
  )
  (:init
    (in office_04 container_04)
    (in office_02 container_04)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
