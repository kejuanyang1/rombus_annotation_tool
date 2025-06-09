(define (problem 69_1-goal)
  (:domain gripper-strips)
  (:objects
    office_06 - item
    tool_02 - item
    tool_04 - item
    tool_06 - item
    other_04 - item
    container_03 - container
    container_05 - container
  )
  (:init
    (in tool_04 container_03)
    (in office_06 container_03)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
